import React, { useEffect, useState } from "react";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import RankingCard from "./RankingCard";

interface RankingComponent {
  imageUrl: string,
  name: string,
  title: number,
  userID: string,
  visitCount: number,
}

const Ranking: React.FC = () => {
  const [ranking, setRanking] = useState<RankingComponent[]>([]);

  const storage = getStorage();

  const fetchVisitRanking = async (): Promise<RankingComponent[]> => {
    const today = new Date();
    // const url = process.env.RANKING_URL;
    try {
      const response = await fetch("https://us-central1-menmen-d01dd.cloudfunctions.net/generateVisitRanking");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const rankingData = await response.json();
      console.log('rankingData:', rankingData);
      const ImageDownloadRankingData = await Promise.all(
        rankingData.ranking.map(async (data: RankingComponent) => {
          const imageURL = await getDownloadURL(ref(storage, data.imageUrl));
          return {
            ...data,
            imageUrl: imageURL,
          };
        }),
      );
      return ImageDownloadRankingData;
    } catch (error) {
      console.error('Fetch error', error);
      return [];
    }
  }

  useEffect(() => {
    const fetchAndSetRanking = async () => {
      try {
        const rankingData = await fetchVisitRanking();
        console.log('rankingData:', rankingData);
        if (rankingData) {
          setRanking(rankingData);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchAndSetRanking();
  }, [])

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