package com.resumeverifier.backend.service;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class ScoringService {

    public Double calculateTruthScore(Map<String, Object> aiResponse) {
        Double skillConsistency = getDouble(aiResponse, "skillConsistency");
        Double projectAuthenticity = getDouble(aiResponse, "projectConsistency"); // Mapping projectConsistency to
                                                                                  // Authenticity
        Double timelineValidity = getDouble(aiResponse, "timelineConsistency");
        Double educationCredibility = getDouble(aiResponse, "educationCredibility");
        Double aiConfidenceScore = getDouble(aiResponse, "questionConfidence"); // Using questionConfidence as proxy or
                                                                                // separate field

        // Default to 0.0 if null to avoid NPE, though ideally AI should return all
        skillConsistency = skillConsistency != null ? skillConsistency : 0.0;
        projectAuthenticity = projectAuthenticity != null ? projectAuthenticity : 0.0;
        timelineValidity = timelineValidity != null ? timelineValidity : 0.0;
        educationCredibility = educationCredibility != null ? educationCredibility : 0.0;
        aiConfidenceScore = aiConfidenceScore != null ? aiConfidenceScore : 0.0;

        return (0.30 * skillConsistency) +
                (0.20 * projectAuthenticity) +
                (0.20 * timelineValidity) +
                (0.15 * educationCredibility) +
                (0.15 * aiConfidenceScore);
    }

    private Double getDouble(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return null;
    }
}
