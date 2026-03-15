package tr.edu.trakya.kycuby.eventapproval.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ClubRequest(
        @NotBlank(message = "Kulüp adı boş olamaz")
        @Size(min = 2, max = 150, message = "Kulüp adı 2-150 karakter arasında olmalıdır")
        String name,

        @NotNull(message = "Danışman ID boş olamaz")
        Long advisorId,

        @NotNull(message = "Başkan ID boş olamaz")
        Long presidentId
) {}
