import fs from 'fs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/fr';
import { revalidatePath } from 'next/cache';

type DataItem = {
  start: string;
  startPause: string;
  endPause: string;
  end: string;
}

type Data = {
  [key: string]: DataItem;
}

const Page = () => {
  dayjs.locale('fr');
  dayjs.extend(customParseFormat);
  const data: Data = JSON.parse(fs.readFileSync('src/app/horaires/data.json', 'utf8'));

  const currentDayData: DataItem | null = data?.[dayjs().format('DD-MM-YYYY')];

  const wrifeFile = async (formData: FormData) => {
    'use server';

    try {
      fs.writeFileSync('src/app/horaires/data.json', JSON.stringify({
        ...data,
        [dayjs().format('DD-MM-YYYY')]: {
          start: formData.get('start') as string,
          startPause: formData.get('startPause') as string,
          endPause: formData.get('endPause') as string,
          end: formData.get('end') as string,
        }
      }, null, 2));

      revalidatePath('/horaires');
    } catch (error) {
      console.error(error);
    }
  }

  const backup = async () => {
    'use server';

    try {
      fs.writeFileSync(`src/app/horaires/backup/${dayjs().format('DD-MM-YYYY')}-backup.json`, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
    }
  }

  const getDay = (dateString: string) => {
    const date = dayjs(dateString, 'DD-MM-YYYY', 'fr');
    return date.format('dddd');
  }

  const getItemTime = (item: DataItem) => {
    const start = dayjs(item.start, 'HH:mm');
    const startPause = dayjs(item.startPause, 'HH:mm');
    const endPause = dayjs(item.endPause, 'HH:mm');
    const end = dayjs(item.end, 'HH:mm');
    const pause = endPause.diff(startPause, 'minute');
    const total = end.diff(start, 'minute') - pause;

    return total;
  }

  const subtractWorkDayHours = (date: string, item: DataItem) => {
    const minutes = getItemTime(item);
    const day = getDay(date);

    if (day === 'vendredi') {
      return minutes - (7 * 60);
    }

    return minutes - (8 * 60);
  }

  const convertMinutesToHHmm = (minutes: number) => {
    if (minutes === 0) {
      return '0:00';
    }

    // minutes to dayjs object
    const dayjsObject = dayjs().startOf('day').add(Math.abs(minutes), 'minute');

    return `${minutes < 0 ? '-' : ''}${dayjsObject.format('H:mm')}`;
  }

  const totalResult = Object.entries(data).reduce((acc, [date, item]) => {
    return acc + subtractWorkDayHours(date, item);
  }, 0);

  return <>
    <form action={wrifeFile}>
      <table style={{ width: '100%', textAlign: 'center' }} border={1}>
        <thead>
          <tr>
            <td>Jour</td>
            <td>Date</td>
            <td>Debut</td>
            <td>Debut Pause</td>
            <td>Fin Pause</td>
            <td>Fin</td>
            <td>Resultat</td>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(( [date, item]) => {
            return (
              <tr key={date}>
                <td>{getDay(date)}</td>
                <td>{date}</td>
                <td>{item.start}</td>
                <td>{item.startPause}</td>
                <td>{item.endPause}</td>
                <td>{item.end}</td>
                <td>
                  {convertMinutesToHHmm(subtractWorkDayHours(date, item))}
                </td>
              </tr>
            );
          })}
          <tr>
            <td>-</td>
            <td>-</td>
            <td>
              <input
                type="time"
                name="start"
                defaultValue={currentDayData?.start || ''}
              />
            </td>
            <td>
              <input
                type="time"
                name="startPause"
                defaultValue={currentDayData?.startPause || ''}
              />
            </td>
            <td>
              <input
                type="time"
                name="endPause"
                defaultValue={currentDayData?.endPause || ''}
              />
            </td>
            <td>
              <input
                type="time"
                name="end"
                defaultValue={currentDayData?.end || ''}
              />
            </td>
            <td>
              {Math.floor(totalResult / 60)}:{Math.floor(totalResult % 60)}
            </td>
          </tr>
        </tbody>
      </table>
      <button type="submit">submit</button>
    </form>
    <form action={backup}>
      <button type="submit">backup</button>
    </form>
  </>;
}

export default Page;