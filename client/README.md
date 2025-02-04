# Boba | Client App

Boba is a Next.js application designed to help users discover Minor League Baseball (MiLB) prospects with 98% accuracy (R²). It provides a user-friendly interface to explore the 2025 MiLB prospect pool. The app leverages Next.js, Firebase, and Tailwind CSS for a modern and efficient experience.

## Contributors

| Developer                   | Affiliation          |
| ------------------------------------------------ | ------------------------------ |
| [Ebod Shojaei](https://github.com/ebodshojaei/) | BSc. University of British Columbia |
| [Rebecca Jeon](https://github.com/rebecca-jeon/) | BSc. University of Victoria     |

## Features

* View a comprehensive list of all 2025 MiLB prospects.
* Explore individual MiLB prospect profiles by clicking on their names.
* Sort MiLB prospects based on their ranking.

Data is persistently stored in a Firebase database. Images are efficiently handled as base64 encoded strings within the database. The application intelligently fetches data from Firebase and utilizes local storage caching to minimize database requests and optimize performance.

## Routes

* `/`: Home page showcasing a list of all 2025 MiLB prospects.
* `/about`: About page providing detailed information about the MLB testing data and the "bWAR" metric.
* `/contact`: Contact page featuring a form for users to submit inquiries, feedback, or bug reports.

## Data

All data was sourced from the [MLB Stats API](https://statsapi.mlb.com/). Our proprietary machine learning model (Vertex AI) was trained on over 6,000 players and rigorously tested on over 1,500 players spanning the 2015 to 2024 seasons. This model is used to predict all available prospects (over 600) for 2025. Trained on comprehensive player statistics, the model predicts WAR (Wins Above Replacement) for each player, which we've aptly named "bWAR" (Boba Wins Above Replacement).

Our WAR Machine demonstrates an impressive 98% accuracy (R²) in predicting MiLB prospects, based on our testing results. Error rates were meticulously calculated using a modified version of Symmetric Mean Absolute Percentage Error (sMAPE) for two values, indicating both magnitude and direction within a range of -100% to 100% (0% sMAPE is perfect accuracy). If 2023 data was available for an MiLB player, we calculated the change in bWAR to indicate the player's growth or decline.

## Acknowledgements

* [MLB Stats API](https://statsapi.mlb.com/)

---

**Disclaimer:**

* This project was created for submission to the 2025 Google X MLB Hackathon.
* We are not affiliated with the MLB or any of its partners.
* AI predictions are not guaranteed to be accurate.
* We are not responsible for any errors or inaccuracies in the data.
* The use of AI was for debugging purposes only.
