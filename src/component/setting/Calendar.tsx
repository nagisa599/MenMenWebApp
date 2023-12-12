import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CalendarComponentProps {
  selectedDates: Date[];
  setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ selectedDates, setSelectedDates }) => {
  const handleCalendarChange = (value: Date | Date[]) => {
    // 単一の日付の場合のみ処理する
    if (value instanceof Date) {
      setSelectedDates(prevDates => {
        // 既に選択されている日付でないことを確認
        if (!prevDates.some(date => date.getTime() === value.getTime())) {
          return [...prevDates, value];
        }
        return prevDates;
      });
    }
  };

  const handleRemoveDate = (dateToRemove: Date) => {
    setSelectedDates(prevDates =>
      prevDates.filter(date => date.getTime() !== dateToRemove.getTime())
    );
  };

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1; // 月は0から始まるため、1を足す
    const day = date.getDate();
    return `${month}/${day}`; // MM/DD 形式
  };

  return (
    <div className="p-4">
      <Calendar
        onClickDay={handleCalendarChange}
      />
      <div className="mt-4 w-80">
        <h3>選択された日付:</h3>
        <ul>
          {selectedDates.map((date, index) => (
            <li key={index} className="flex justify-between items-center mb-1">
              {formatDate(date)}
              <button
                className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                onClick={() => handleRemoveDate(date)}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarComponent;
