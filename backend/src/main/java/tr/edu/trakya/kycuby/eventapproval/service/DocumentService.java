package tr.edu.trakya.kycuby.eventapproval.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tr.edu.trakya.kycuby.eventapproval.entity.Petition;

import java.io.*;
import java.math.BigInteger;
import java.nio.file.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Apache POI kullanarak 2 sayfalık Word belgesi oluşturan servis.
 *
 * Sayfa 1: Müdürlüğe dilekçe mektubu
 * Sayfa 2: EK-1 Etkinlik Hazırlama İş Akış Planı tablosu
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    @Value("${app.document.output-dir}")
    private String outputDir;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    private static final String FONT = "Times New Roman";

    // -----------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------

    /**
     * Dilekçe verileriyle 2 sayfalık Word belgesi oluşturur.
     *
     * @param petition    form verileri
     * @param clubName    kulüp adı
     * @param advisorName akademik danışman adı (imza alanında kullanılır)
     * @return oluşturulan dosyanın yolu
     */
    public String generateDocument(Petition petition, String clubName, String advisorName) {
        try {
            XWPFDocument document = new XWPFDocument();

            setPageMargins(document);

            // ---- Sayfa 1: Dilekçe mektubu ----
            buildPage1Letter(document, petition, clubName, advisorName);

            // ---- Sayfa sonu ----
            addPageBreak(document);

            // ---- Sayfa 2: EK-1 tablosu ----
            buildPage2Table(document, petition, clubName);

            // ---- Dosyaya kaydet ----
            return saveDocument(document, petition);

        } catch (IOException e) {
            log.error("Belge oluşturulurken hata: {}", e.getMessage(), e);
            throw new RuntimeException("Belge oluşturulurken bir hata meydana geldi", e);
        }
    }

    // -----------------------------------------------------------------------
    // Sayfa 1 – Müdürlüğe dilekçe mektubu
    // -----------------------------------------------------------------------

    private void buildPage1Letter(XWPFDocument doc, Petition petition,
            String clubName, String advisorName) {
        // Üst boşluk
        addEmptyParagraphs(doc, 3);

        // Başlık bloku (ortalı, bold)
        addCenteredBoldParagraph(doc, "TRAKYA ÜNİVERSİTESİ", 12);
        addCenteredBoldParagraph(doc, "KEŞAN YUSUF ÇAPRAZ UYGULAMALI BİLİMLER YÜKSEKOKULU", 12);
        addCenteredBoldParagraph(doc, "MÜDÜRLÜĞÜ'NE", 12);

        addEmptyParagraphs(doc, 2);

        // Gövde metni
        String dateStr = formatDateRange(petition);
        String timeStr = formatTimeRange(petition);

        String bodyText = String.format(
                "Danışmanlığını yürütmekte olduğum yüksekokulumuzda faaliyet gösteren %s olarak" +
                        " %s adlı etkinliği %s tarih ve %s saatleri arasında" +
                        " düzenlemeyi planlamaktayız.",
                clubName,
                petition.getEventName(),
                dateStr,
                timeStr);

        XWPFParagraph body = doc.createParagraph();
        body.setIndentationFirstLine(720); // 0.5 inch girinti
        XWPFRun bodyRun = body.createRun();
        bodyRun.setFontFamily(FONT);
        bodyRun.setFontSize(12);
        bodyRun.setText(bodyText);

        addEmptyParagraphs(doc, 1);

        // Kapanış cümlesi
        XWPFParagraph closing = doc.createParagraph();
        closing.setIndentationFirstLine(720);
        XWPFRun closingRun = closing.createRun();
        closingRun.setFontFamily(FONT);
        closingRun.setFontSize(12);
        closingRun.setText("Bilgilerinize arz ederim.");

        addEmptyParagraphs(doc, 3);

        // İmza bloğu (sağa hizalı)
        addRightAlignedParagraph(doc, "Adı-Soyadı-İmza", false);
        addRightAlignedParagraph(doc, "Topluluk Akademik Danışmanı", false);
        addRightAlignedParagraph(doc, advisorName != null ? advisorName : "...", false);

        addEmptyParagraphs(doc, 3);

        // EKLER bölümü
        addNormalParagraph(doc, "EKLER", true);
        addNormalParagraph(doc, "EK-1 Etkinlik Hazırlama İş Akış Planı", false);
        addNormalParagraph(doc, "EK-2 Etkinlik Afişi", false);
    }

    // -----------------------------------------------------------------------
    // Sayfa 2 – EK-1 tablosu
    // -----------------------------------------------------------------------

    private void buildPage2Table(XWPFDocument doc, Petition petition, String clubName) {

        // "EK-1" başlığı
        addCenteredBoldParagraph(doc, "EK-1", 12);
        addEmptyParagraphs(doc, 1);

        // Alt başlık
        addCenteredBoldParagraph(doc, "KEŞAN YUSUF ÇAPRAZ UYGULAMALI BİLİMLER YÜKSEKOKULU", 12);
        addCenteredBoldParagraph(doc, "ÖĞRENCİ TOPLULUKLARI", 12);
        addCenteredBoldParagraph(doc, "ETKİNLİK HAZIRLAMA İŞ AKIŞ PLANI", 12);

        addEmptyParagraphs(doc, 1);

        // Tablo
        XWPFTable table = doc.createTable();

        // Satır tanımları: [ etiket, değer ]
        String[][] rows = {
                {
                        "Topluluk Adı",
                        clubName
                },
                {
                        "Etkinliğin İsmi",
                        petition.getEventName()
                },
                {
                        "Etkinlik Tarihi ve Saati",
                        formatDateRange(petition) + "  /  " + formatTimeRange(petition)
                },
                {
                        "Etkinliğin Yeri",
                        petition.getLocation()
                },
                {
                        "Etkinliğin İçeriği",
                        petition.getEventContent()
                },
                {
                        "Etkinliğe destek veren kurum ve desteğin niteliği",
                        petition.getSupportInfo() != null ? petition.getSupportInfo() : "—"
                },
                {
                        "Konuşmacının Adı-Soyadı Çalıştığı/Bağlı Olduğu Kurum ve Unvanı",
                        formatSpeakerInfo(petition.getSpeakerInfo())
                },
                {
                        "Sonuç raporu ve etkinlik haberinin web sitesinde yayınlanması",
                        "..."
                },
        };

        boolean firstRow = true;
        for (String[] rowData : rows) {
            XWPFTableRow tableRow;
            if (firstRow) {
                // createTable() zaten 1 boş satır ekliyor; onu kullan
                tableRow = table.getRow(0);
                firstRow = false;
            } else {
                tableRow = table.createRow();
            }

            // Hücre 1: etiket (bold)
            XWPFTableCell labelCell = tableRow.getCell(0);
            if (labelCell == null)
                labelCell = tableRow.addNewTableCell();
            setCellWidth(labelCell, 3000);
            setCellText(labelCell, rowData[0], true);

            // Hücre 2: değer
            XWPFTableCell valueCell = tableRow.getCell(1);
            if (valueCell == null)
                valueCell = tableRow.addNewTableCell();
            setCellWidth(valueCell, 6000);
            setCellText(valueCell, rowData[1], false);
        }
    }

    // -----------------------------------------------------------------------
    // Yardımcı: hücre işlemleri
    // -----------------------------------------------------------------------

    private void setCellText(XWPFTableCell cell, String text, boolean bold) {
        // Mevcut varsayılan paragrafı temizle
        if (!cell.getParagraphs().isEmpty()) {
            cell.removeParagraph(0);
        }
        XWPFParagraph para = cell.addParagraph();
        XWPFRun run = para.createRun();
        run.setFontFamily(FONT);
        run.setFontSize(11);
        run.setBold(bold);
        run.setText(text != null ? text : "");
    }

    private void setCellWidth(XWPFTableCell cell, int widthTwips) {
        CTTcPr tcPr = cell.getCTTc().getTcPr();
        if (tcPr == null)
            tcPr = cell.getCTTc().addNewTcPr();
        CTTblWidth cellWidth = tcPr.isSetTcW() ? tcPr.getTcW() : tcPr.addNewTcW();
        cellWidth.setW(BigInteger.valueOf(widthTwips));
        cellWidth.setType(STTblWidth.DXA);
    }

    // -----------------------------------------------------------------------
    // Yardımcı: paragraf oluşturma
    // -----------------------------------------------------------------------

    private void addCenteredBoldParagraph(XWPFDocument doc, String text, int fontSize) {
        XWPFParagraph para = doc.createParagraph();
        para.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun run = para.createRun();
        run.setFontFamily(FONT);
        run.setFontSize(fontSize);
        run.setBold(true);
        run.setText(text);
    }

    private void addRightAlignedParagraph(XWPFDocument doc, String text, boolean bold) {
        XWPFParagraph para = doc.createParagraph();
        para.setAlignment(ParagraphAlignment.RIGHT);
        XWPFRun run = para.createRun();
        run.setFontFamily(FONT);
        run.setFontSize(12);
        run.setBold(bold);
        run.setText(text);
    }

    private void addNormalParagraph(XWPFDocument doc, String text, boolean bold) {
        XWPFParagraph para = doc.createParagraph();
        XWPFRun run = para.createRun();
        run.setFontFamily(FONT);
        run.setFontSize(12);
        run.setBold(bold);
        run.setText(text);
    }

    private void addEmptyParagraphs(XWPFDocument doc, int count) {
        for (int i = 0; i < count; i++) {
            XWPFParagraph para = doc.createParagraph();
            XWPFRun run = para.createRun();
            run.setFontFamily(FONT);
            run.setFontSize(12);
        }
    }

    private void addPageBreak(XWPFDocument doc) {
        XWPFParagraph para = doc.createParagraph();
        XWPFRun run = para.createRun();
        run.addBreak(BreakType.PAGE);
    }

    // -----------------------------------------------------------------------
    // Yardımcı: sayfa kenar boşlukları (1.25 sol, 1 diğer taraflar)
    // -----------------------------------------------------------------------

    private void setPageMargins(XWPFDocument doc) {
        CTSectPr sectPr = doc.getDocument().getBody().addNewSectPr();
        CTPageMar pageMar = sectPr.addNewPgMar();
        pageMar.setTop(BigInteger.valueOf(1440)); // 1 inch
        pageMar.setBottom(BigInteger.valueOf(1440)); // 1 inch
        pageMar.setLeft(BigInteger.valueOf(1800)); // 1.25 inch
        pageMar.setRight(BigInteger.valueOf(1440)); // 1 inch
    }

    // -----------------------------------------------------------------------
    // Yardımcı: tarih / saat formatlama
    // -----------------------------------------------------------------------

    private String formatDateRange(Petition petition) {
        if (petition.getEventStartDate().equals(petition.getEventEndDate())) {
            return petition.getEventStartDate().format(DATE_FORMATTER);
        }
        return petition.getEventStartDate().format(DATE_FORMATTER)
                + " - "
                + petition.getEventEndDate().format(DATE_FORMATTER);
    }

    private String formatTimeRange(Petition petition) {
        if (petition.getEventStartTime().equals(petition.getEventEndTime())) {
            return petition.getEventStartTime();
        }
        return petition.getEventStartTime() + " - " + petition.getEventEndTime();
    }

    // -----------------------------------------------------------------------
    // Yardımcı: konuşmacı JSON → okunabilir metin
    // -----------------------------------------------------------------------

    private String formatSpeakerInfo(String speakerJson) {
        if (speakerJson == null || speakerJson.trim().isEmpty())
            return "—";
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, String>> speakers = mapper.readValue(
                    speakerJson, new TypeReference<List<Map<String, String>>>() {
                    });
            if (speakers.isEmpty())
                return "—";

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < speakers.size(); i++) {
                Map<String, String> s = speakers.get(i);
                String fullName = s.getOrDefault("fullName", "");
                String title = s.getOrDefault("title", "");
                String company = s.getOrDefault("company", "");
                sb.append(fullName);
                if (!title.isEmpty() || !company.isEmpty()) {
                    sb.append(" (");
                    if (!title.isEmpty())
                        sb.append(title);
                    if (!title.isEmpty() && !company.isEmpty())
                        sb.append(", ");
                    if (!company.isEmpty())
                        sb.append(company);
                    sb.append(")");
                }
                if (i < speakers.size() - 1)
                    sb.append(", ");
            }
            return sb.toString();
        } catch (Exception e) {
            log.warn("Konuşmacı JSON formatı çözülemedi, ham metin kullanılacak.", e);
            return speakerJson;
        }
    }

    // -----------------------------------------------------------------------
    // Dosyaya kaydetme
    // -----------------------------------------------------------------------

    private String saveDocument(XWPFDocument document, Petition petition) throws IOException {
        Path outputPath = Paths.get(outputDir);
        Files.createDirectories(outputPath);

        String safeEventName = petition.getEventName()
                .replaceAll("[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]", "_");
        String fileName = String.format("dilekce_%s_%s.docx",
                safeEventName, System.currentTimeMillis());

        Path filePath = outputPath.resolve(fileName);
        try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
            document.write(fos);
        }
        document.close();

        log.info("Belge başarıyla oluşturuldu: {}", filePath);
        return filePath.toString();
    }
}