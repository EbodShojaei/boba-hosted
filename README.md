# Boba | Discover 2024 MiLB Prospects with 97% Accuracy

Boba is a Next.js application that helps users discover Minor League Baseball (MiLB) prospects using a machine learning model with 97% predictive accuracy (R²). It provides a user-friendly interface to explore the most recent 2024 MiLB prospect pool, offering detailed prospect profiles and rankings. The app leverages Next.js, Firebase, and Tailwind CSS for a modern and efficient experience.

## Contributors

| Developer                   | Affiliation          | Contact
| ------------------------------------------------ | ------------------------------ | ------------------------------ |
| [Ebod Shojaei](https://github.com/ebodshojaei/) | BSc. University of British Columbia | ebod.shojaei@alumni.ubc.ca |
| [Rebecca Jeon](https://github.com/rebecca-jeon/) | BSc. University of Victoria     | beccajeon12@gmail.com         |

## Features

* View a comprehensive list of all 2024 MiLB prospects.
* Explore individual MiLB prospect profiles.
* Sort MiLB prospects by ranking.

## Technologies

* **Frontend:** Next.js, Tailwind CSS
* **Backend:** Firebase

## Routes

* `/`: Home page showcasing a list of 2024 MiLB prospects.
* `/about`: About page with details on the MLB testing data and the "bWAR" metric.
* `/contact`: Contact page for inquiries, feedback, or bug reports.

## Data and Methodology

Data is sourced from the [MLB Stats API](https://statsapi.mlb.com/). Our proprietary machine learning model (H2O.ai Stacked Ensemble) was trained on over 6,000 players and rigorously tested on over 1,500 players from the 2015 to 2024 seasons.  This model predicts WAR (Wins Above Replacement), which we name "bWAR" (Boba Wins Above Replacement), for over 600 available 2024 prospects.

Our "WAR Machine" achieves 97% accuracy (R²) in predicting MiLB prospect WAR based on testing. Error rates were calculated using a modified Symmetric Mean Absolute Percentage Error (sMAPE) for two values, indicating both magnitude and direction within a range of -100% to 100% (0% sMAPE is perfect accuracy).  Change in bWAR was calculated for players with available 2023 data to indicate growth or decline.

The model training process included:

1. Data Loading
2. Data Splitting (Train/Test)
3. Data Cleaning
4. Missing Value Imputation
5. Feature Scaling
6. Model Training (using H2O.ai AutoML)
7. Model Evaluation
8. Prediction on 2024 MiLB data
9. Model Saving
10. Prediction Saving

A subset of the following pitching statistics from the MLB Stats API were used as features for model training:

| Field                      | Description                                    |
|---------------------------|-------------------------------------------------|
| `stat.gamesPlayed`        | Number of games pitched.                        |
| `stat.gamesStarted`       | Number of games started.                        |
| `stat.gamesFinished`      | Number of games finished.                       |
| `stat.completeGames`      | Number of complete games.                       |
| `stat.shutouts`           | Number of shutouts.                             |
| `stat.wins`               | Number of wins.                                 |
| `stat.losses`             | Number of losses.                               |
| `stat.saveOpportunities`  | Number of save opportunities.                   |
| `stat.saves`              | Number of saves.                                |
| `stat.blownSaves`         | Number of blown saves.                          |
| `stat.holds`              | Number of holds.                                |
| `stat.inningsPitched`     | Innings pitched (can be a formatted string).    |
| `stat.runs`               | Runs allowed.                                   |
| `stat.earnedRuns`         | Earned runs allowed.                            |
| `stat.battersFaced`       | Number of batters faced.                        |
| `stat.atBats`             | At-bats against the pitcher.                    |
| `stat.hits`               | Hits allowed.                                   |
| `stat.doubles`            | Doubles allowed.                                |
| `stat.triples`            | Triples allowed.                                |
| `stat.homeRuns`           | Home runs allowed.                              |
| `stat.baseOnBalls`        | Walks issued.                                   |
| `stat.intentionalWalks`   | Intentional walks issued.                       |
| `stat.strikeOuts`         | Strikeouts.                                     |
| `stat.hitByPitch`         | Batters hit by pitch.                           |
| `stat.balks`              | Balks committed.                                |
| `stat.wildPitches`        | Wild pitches.                                   |
| `stat.groundOuts`         | Groundouts induced.                             |
| `stat.airOuts`            | Flyouts induced.                                |
| `stat.stolenBases`        | Stolen bases allowed.                           |
| `stat.caughtStealing`     | Runners caught stealing.                        |
| `stat.sacBunts`           | Sacrifice bunts allowed.                        |
| `stat.sacFlies`           | Sacrifice flies allowed.                        |
| `stat.catchersInterference`| Catcher's interference while pitching.         |
| `stat.pickoffs`           | Pickoffs.                                       |
| `stat.inheritedRunners`   | Inherited runners.                              |
| `stat.inheritedRunnersScored`| Inherited runners scored.                    |
| `stat.numberOfPitches`    | Pitches thrown.                                 |
| `stat.strikes`            | Strikes thrown.                                 |


## Acknowledgements

* [MLB Stats API](https://statsapi.mlb.com/)

---

**Disclaimer:**

* This project was created for submission to the 2025 Google X MLB Hackathon.
* We are not affiliated with the MLB or any of its partners.
* AI predictions are not guaranteed to be accurate.
* We are not responsible for any errors or inaccuracies in the data.
* The use of AI was for debugging purposes only.
