import { fromEvent  } from 'rxjs'; 
import { map} from 'rxjs/operators';

const button = document.querySelector('button');
const getDates = () => {
  const day = 24*60*60*1000; //day in millisecs
  const today = Date.now();
  const result=[[new Date(today)]];
  for(let i=1; i<365; i++){
    const date = new Date(today + i*day);
    const nrOfMonths = result.length;
    const nrOfDaysinLastMonth = result[nrOfMonths-1].length;

   // console.log(result);

    if( result[nrOfMonths-1][nrOfDaysinLastMonth - 1].getMonth() != date.getMonth()) {
      result.push([]);
    }
    result[result.length-1].push(date);
  }
  return result;
};

const source = fromEvent(button,'click').pipe(
  map(_ => getDates())
);

source.subscribe(x => console.log(x,x.map(month => month[0])));