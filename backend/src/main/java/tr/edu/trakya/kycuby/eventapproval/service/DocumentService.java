package tr.edu.trakya.kycuby.eventapproval.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tr.edu.trakya.kycuby.eventapproval.entity.Petition;

import java.io.*;
import java.nio.file.*;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * Apache POI kullanarak Word şablonunu dolduran belge otomasyon servisi.
 * Şablon içindeki ${yer_tutucu} alanları form verileriyle değiştirilir.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    @Value("${app.document.output-dir}")
    private String outputDir;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    /**
     * Dilekçe verileriyle Word belgesini oluşturur.
     *
     * @param petition  form verileri
     * @param clubName  kulüp adı
     * @param presidentName başkan adı
     * @return oluşturulan dosyanın yolu
     */
    public String generateDocument(Petition petition, String clubName, String presidentName) {
        try {
            // Şablon dosyasını oku
            InputStream templateStream = getClass().getResourceAsStream("/templates/petition_template.docx");

            if (templateStream == null) {
                log.warn("Şablon dosyası bulunamadı, varsayılan belge oluşturuluyor...");
                return generateDefaultDocument(petition, clubName, presidentName);
            }

            XWPFDocument document = new XWPFDocument(templateStream);

            // Yer tutucu haritası
            Map<String, String> placeholders = Map.of(
                    "${etkinlikAdi}", petition.getEventName(),
                    "${etkinlikTarihi}", petition.getEventDate().format(DATE_FORMATTER),
                    "${etkinlikYeri}", petition.getLocation(),
                    "${aciklama}", petition.getDescription(),
                    "${kulupAdi}", clubName,
                    "${baskanAdi}", presidentName,
                    "${tarih}", petition.getCreatedAt() != null
                            ? petition.getCreatedAt().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"))
                            : "—"
            );

            // Paragraflar içindeki yer tutucuları değiştir
            replacePlaceholdersInParagraphs(document.getParagraphs(), placeholders);

            // Tablolar içindeki yer tutucuları değiştir
            for (XWPFTable table : document.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    for (XWPFTableCell cell : row.getTableCells()) {
                        replacePlaceholdersInParagraphs(cell.getParagraphs(), placeholders);
                    }
                }
            }

            // Çıktı dizinini oluştur
            Path outputPath = Paths.get(outputDir);
            Files.createDirectories(outputPath);

            // Dosya adı
            String fileName = String.format("dilekce_%s_%s.docx",
                    petition.getEventName().replaceAll("[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]", "_"),
                    System.currentTimeMillis());

            Path filePath = outputPath.resolve(fileName);

            try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
                document.write(fos);
            }
            document.close();
            templateStream.close();

            log.info("Belge başarıyla oluşturuldu: {}", filePath);
            return filePath.toString();

        } catch (IOException e) {
            log.error("Belge oluşturulurken hata: {}", e.getMessage(), e);
            throw new RuntimeException("Belge oluşturulurken bir hata meydana geldi", e);
        }
    }

    /**
     * Şablon yoksa varsayılan bir belge oluşturur.
     */
    private String generateDefaultDocument(Petition petition, String clubName, String presidentName) throws IOException {
        XWPFDocument document = new XWPFDocument();

        // Başlık
        XWPFParagraph title = document.createParagraph();
        title.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun titleRun = title.createRun();
        titleRun.setBold(true);
        titleRun.setFontSize(16);
        titleRun.setText("ETKİNLİK ONAY DİLEKÇESİ");
        titleRun.addBreak();

        // Kulüp bilgisi
        addParagraph(document, "Kulüp Adı: " + clubName);
        addParagraph(document, "Başkan: " + presidentName);
        addParagraph(document, "");

        // Etkinlik bilgileri
        addParagraph(document, "Etkinlik Adı: " + petition.getEventName());
        addParagraph(document, "Etkinlik Tarihi: " + petition.getEventDate().format(DATE_FORMATTER));
        addParagraph(document, "Etkinlik Yeri: " + petition.getLocation());
        addParagraph(document, "");
        addParagraph(document, "Açıklama:");
        addParagraph(document, petition.getDescription());

        // Çıktı
        Path outputPath = Paths.get(outputDir);
        Files.createDirectories(outputPath);

        String fileName = String.format("dilekce_%s_%s.docx",
                petition.getEventName().replaceAll("[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]", "_"),
                System.currentTimeMillis());

        Path filePath = outputPath.resolve(fileName);
        try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
            document.write(fos);
        }
        document.close();

        log.info("Varsayılan belge oluşturuldu: {}", filePath);
        return filePath.toString();
    }

    private void addParagraph(XWPFDocument document, String text) {
        XWPFParagraph paragraph = document.createParagraph();
        XWPFRun run = paragraph.createRun();
        run.setFontSize(12);
        run.setText(text);
    }

    private void replacePlaceholdersInParagraphs(java.util.List<XWPFParagraph> paragraphs,
                                                  Map<String, String> placeholders) {
        for (XWPFParagraph paragraph : paragraphs) {
            String fullText = paragraph.getText();
            if (fullText == null) continue;

            for (Map.Entry<String, String> entry : placeholders.entrySet()) {
                if (fullText.contains(entry.getKey())) {
                    // Run'ları birleştirip değiştir
                    for (XWPFRun run : paragraph.getRuns()) {
                        String text = run.getText(0);
                        if (text != null && text.contains(entry.getKey())) {
                            run.setText(text.replace(entry.getKey(), entry.getValue()), 0);
                        }
                    }
                }
            }
        }
    }
}
