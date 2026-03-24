package tr.edu.trakya.kycuby.eventapproval.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record PetitionRequest(

        @NotBlank(message = "Etkinlik adı boş olamaz")
        String eventName,

        @NotNull(message = "Etkinlik başlangıç tarihi boş olamaz")
        @FutureOrPresent(message = "Etkinlik tarihi geçmiş bir tarih olamaz")
        LocalDate eventStartDate,

        @NotNull(message = "Etkinlik bitiş tarihi boş olamaz")
        @FutureOrPresent(message = "Etkinlik tarihi geçmiş bir tarih olamaz")
        LocalDate eventEndDate,

        @NotBlank(message = "Etkinlik yeri boş olamaz")
        String location,

        @NotBlank(message = "Etkinlik başlangıç saati boş olamaz")
        String eventStartTime,

        @NotBlank(message = "Etkinlik bitiş saati boş olamaz")
        String eventEndTime,

        @NotBlank(message = "Etkinlik içeriği boş olamaz")
        String eventContent,

        String supportInfo,

        String speakerInfo
) {}
