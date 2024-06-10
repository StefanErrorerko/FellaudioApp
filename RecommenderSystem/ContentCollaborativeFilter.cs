using System.Linq;

namespace FellaudioApp.RecommenderSystem
{
    public class ContentCollaborativeFilter
    {
        private readonly static double alpha = 0.5;
        private readonly static double SIM_HIGH_TRESHOLD = 0.9;
        private readonly static int HIGH_SIM_COUNT = 1;
        private readonly static int COMM_SIM_COUNT = 5;
        private readonly static double CONT_TRESHOLD = 0.2;

        /*
        public static (double, double) GetK(Dictionary<int, double> similarityScores)
        {
            var similarityScoresValues = new List<double>(similarityScores.Values);
            similarityScoresValues.Sort((a, b) => -a.CompareTo(b)); // Сортуємо в порядку спадання схожості

            // Обчислюємо вагований середній ранг схожості
            double weightedSum = 0;
            double highestSimilarity = 0; // значення схожості, що більше за поріг (0, якщо немає такого)
            foreach (var similarity in similarityScoresValues)
            {
                weightedSum += similarity;
                if (similarity >= SIM_HIGH_TRESHOLD)
                    highestSimilarity = similarity;
            }

            double k1 = 0;

            // якщо схожих користувачів багато (більше за поріг), вираховуємо зважену суму
            if (similarityScores.Count >= COMM_SIM_COUNT)
                k1 = weightedSum / similarityScores.Count;
            // якщо користувачів схожих мало, коєфіцієнт 0,5
            if (0 < similarityScores.Count && similarityScores.Count < COMM_SIM_COUNT)
                k1 = 0.5;
            // якщо є користувач з великою схожістю, збільшуємо коєфіцієнт шляхом знаходження сер. арифм. між зваженою сумою і найб.елементом
            if (highestSimilarity > 0)
                k1 = (k1 + highestSimilarity) / 2;


            return (k1, 1 - k1);
        }*/

        // Функція для обчислення косинусної схожості між двома користувачами
        public static double CosineSimilarity(Dictionary<int, int> di, Dictionary<int, int> dj)
        {
            var commonItems = di.Keys.Intersect(dj.Keys);
            double dotProduct = commonItems.Sum(item => di[item] * dj[item]);
            double magnitude1 = Math.Sqrt(di.Values.Sum(dik => dik * dik));
            double magnitude2 = Math.Sqrt(dj.Values.Sum(djk => djk * djk));
            return (magnitude1 == 0 || magnitude2 == 0) ? 0 : dotProduct / (magnitude1 * magnitude2);
        }

        // Функція для отримання рекомендацій для користувача
        public static List<int> GetRecommendations(Dictionary<int, Dictionary<int, int>> d, int t)
        {
            var userUnratedItems = d.SelectMany(r => r.Value.Keys).Distinct().Where(i => !d[t].ContainsKey(i)).ToList();
            var recommendations = new Dictionary<int, double>();

            // Крок 1. Вирахування конусної схожості
            var sim = new Dictionary<int, double>();
            foreach (var j in d.Keys)
            {
                // дивимось кожного користувача (крім того, кому рекомендують)
                if (j == t)
                    continue;

                // рахуємо косинусну схожість з кожним користувачем
                double similarity = CosineSimilarity(d[t], d[j]);
                
                // Крок 1а. Беремо тих користувачів, схожість із якими вища за поріг
                if (similarity >= alpha)
                    sim.Add(j, similarity);
            }

            // Крок 2. Вирахування коєфіцієнтів k1 та k2
            //(double k1, double k2) = GetK(sim);

            // Крок 3. Вирахування коєфіцієнтів для контенту та складання списку рекомендацій
            foreach (var k in userUnratedItems)
            {
                double WRel = 0;
                foreach (var j in d.Keys)
                {
                    // дивимось тих користувачів, що пройшли поріг
                    if (!sim.ContainsKey(j))
                        continue;

                    if (d[j].ContainsKey(k))
                    {
                        WRel += d[j][k] * sim[j];
                    }

                }
                WRel /= sim.Count;
                if(WRel >= CONT_TRESHOLD)
                    recommendations.Add(k, WRel);
            }

            return recommendations.OrderByDescending(r => r.Value).Select(r => r.Key).ToList();
        }
    }
}
