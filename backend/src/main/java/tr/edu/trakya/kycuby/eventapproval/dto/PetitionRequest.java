package tr.edu.trakya.kycuby.eventapproval.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record PetitionRequest(

        @NotBlank(message = "Etkinlik adı boş olamaz")
        String eventName,

        @NotNull(message = "Etkinlik tarihi boş olamaz")
        @FutureOrPresent(message = "Etkinlik tarihi geçmiş bir tarih olamaz")
        LocalDate eventDate,

        @NotBlank(message = "Etkinlik yeri boş olamaz")
        String location,

        @NotBlank(message = "Açıklama boş olamaz")
        String description
) {}
