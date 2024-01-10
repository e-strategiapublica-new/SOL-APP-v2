export default class FilterFuzzy {
  static levenshteinDistance(str1: string, str2: string) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    const m = str1.length;
    const n = str2.length;

    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
      for (let j = 0; j <= n; j++) {
        if (i === 0) {
          dp[i][j] = j;
        } else if (j === 0) {
          dp[i][j] = i;
        } else if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] =
            1 +
            Math.min(
              dp[i - 1][j], // Deleção
              dp[i][j - 1], // Inserção
              dp[i - 1][j - 1] // Substituição
            );
        }
      }
    }
    return dp[m][n];
  }


  static fuzzySearch(query:string, array:IArrayFuzzy[]):IResultFuzzy[]{
    const results = [];
    const maxDistance = 10; // Define o limite máximo de distância de Levenshtein

    for (const item of array) {
        const distance = this.levenshteinDistance(query, item.termo);
        // results.push({ item: item, distancia: distance });
        if (distance <= maxDistance) {
            results.push({ item: item, distancia: distance, query: query });
        }
    }
    
    
    // Ordena os resultados pela distância (menos distância = melhor correspondência)
    results.sort((a, b) => a.distancia - b.distancia);

    if(results.length > 5) results.splice(5, results.length - 5)

    return results;
  }
}




interface IArrayFuzzy {
  termo: string;
  id: string;
}

interface IResultFuzzy {
  item: IArrayFuzzy;
  distancia: number;
  query?: string;
}
