function populateWithOutcomeInfo(obj, amount, type) {
              const voteTotal = (type !== 'Created' && type !== 'Canceled') ? getRandomInt(amount, amount * 50) : 0;
              // split total votes into parts for each outcome
              const outcomeVotesSplit = [...splitNParts(voteTotal, amount)];
              // create all outcome objects
              for (let i = 0; i < amount; i++) {
                const total_points = outcomeVotesSplit[i];
                // total users are less or equal total votes
                const total_user = total_points !== 0 ? getRandomInt(Math.ceil(total_points / 10), total_points) : 0;
                // avoid having NaN if 0
                const percentage = total_points !== 0 ? parseInt((total_points / voteTotal) * 100) : type === 'Canceled' ? 'nan' : 0;
                let top_predictors = [];
                if (type != 'Created' && type !== 'Canceled' && total_points > 0) {
                  let total_channel_points_used = 0;
                  for (let userCount = 0; userCount < total_user; userCount++) {
                    const username = generateName();
                    // random value between 1 and total points minus channel points used if we have more than 1 predictor
                    const channel_points_used = userCount === total_user - 1 ? total_points - total_channel_points_used : getRandomInt(1, total_points - total_channel_points_used - (total_user - userCount - 1));
                    total_channel_points_used += channel_points_used;
                    top_predictors.push({
                      "channel_points_used": channel_points_used,
                      "channel_points_won": null,
                      "user_name": username[0],
                      "user_id": username[1],
                      "user_login": username[0].toLowerCase()
                    });
                  }
                }
                const outcome = {
                  total_points,
                  percentage,
                  total_user,
                  id: `e960f614-d379-494a-8b45-0c7500978${i}ea`,
                  name: `Test Choice ${i + 1}`,
                  color: i % 2 === 0 ? 'blue' : 'pink',
                  top_predictors: top_predictors
                };
                obj[`outcome_${i + 1}_info`] = outcome;
              }
              obj.vote_total = voteTotal;
              obj.vote_total_points = voteTotal;
              return obj;
            }
