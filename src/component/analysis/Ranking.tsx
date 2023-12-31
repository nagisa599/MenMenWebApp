import React, { useEffect, useState } from "react";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import RankingCard from "./RankingCard";
import { RANKING_URL } from "@/constant/env";
import ErrorMessage from "@/utils/ErrorFormat";

interface RankingComponent {
  imageUrl: string,
  name: string,
  title: number,
  userID: string,
  visitCount: number,
}

const Ranking: React.FC = () => {
  const [ranking, setRanking] = useState<RankingComponent[]>([]);

  const fetchVisitRanking = async (): Promise<RankingComponent[]> => {
    const url = RANKING_URL;
    if (url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const rankingData = await response.json();
        const ImageDownloadRankingData = await Promise.all(
          rankingData.ranking.map(async (data: RankingComponent) => {
            const imageURL = await getDownloadURL(ref(getStorage(), data.imageUrl));
            return {
              ...data,
              imageUrl: imageURL,
            };
          }),
        );
        return ImageDownloadRankingData;
      } catch (err) {
        ErrorMessage('ランキングの取得に失敗しました。', err);
        return [];
      }
    } else {
      ErrorMessage('技術的エラーです。開発者にご連絡ください。');
      return [];
    }
  }

  useEffect(() => {
    fetchVisitRanking().then((rankingData) => {
      setRanking(rankingData);
    })
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-4">ランキング</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ranking.map((rankingComponent, index) => (
          <RankingCard key={rankingComponent.userID} {...rankingComponent} rank={index + 1} />
        ))}
      </div>
    </div>
  )
}

export default Ranking;