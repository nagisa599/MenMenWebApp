import React from "react";
import Image from "next/image";

interface RankingCardComponent {
  imageUrl: string,
  name: string,
  title: number,
  userID: string,
  visitCount: number,
  rank: number,
}

const RankingCard: React.FC<RankingCardComponent> = ({ name, title, visitCount, imageUrl, rank }) => {
  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2">
      <p className="text-sm text-gray-600">{rank}位</p>
      <Image src={imageUrl} alt={name} className="w-24 h-24 rounded-full object-cover" width={150} height={150} />
      <h3 className="mt-2 font-bold">{name}</h3>
      <p className="text-sm text-gray-600">総来店回数: {title}回</p>
      <p className="text-sm text-gray-600">直近３ヶ月来店回数: {visitCount}回</p>
    </div>
  );
};

export default RankingCard;
