import {HitPointResultsResponse} from "./types";

export const HIT_POINT_RESULTS_MOCKS: HitPointResultsResponse = [
    [
        "2d8-2", // Skeleton
        {
            minimum: 1,
            weak: 4,
            average: 7,
            strong: 10,
            maximum: 14
        }
    ],
    [
        "2d8+6", // Orc
        {
            minimum: 8,
            weak: 11,
            average: 15,
            strong: 18,
            maximum: 22
        }
    ],
    [
        "8d10+40", // Gelatinous Cube
        {
            minimum: 48,
            weak: 66,
            average: 84,
            strong: 102,
            maximum: 120
        }
    ],
    [
        "33d20+330", // Tarrasque
        {
            minimum: 363,
            weak: 519,
            average: 676,
            strong: 833,
            maximum: 990
        }
    ]
]