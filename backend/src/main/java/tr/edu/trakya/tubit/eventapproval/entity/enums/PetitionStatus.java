package tr.edu.trakya.tubit.eventapproval.entity.enums;

/**
 * Dilekçe (Petition) onay sürecindeki durum geçişlerini tanımlar.
 *
 * İş akışı:
 * PENDING_ADVISOR → PENDING_ADMIN → APPROVED
 *                                  → REJECTED
 *                 → REJECTED
 */
public enum PetitionStatus {
    PENDING_ADVISOR,  // Danışman onayı bekliyor
    PENDING_ADMIN,    // Admin (Müdür Yardımcısı) onayı bekliyor
    APPROVED,         // Onaylandı
    REJECTED          // Reddedildi
}
