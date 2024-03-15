import { useState, useEffect, ChangeEvent, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Switch,
  Typography,
} from '@material-tailwind/react';

const API_URI = process.env.API_URI || 'http://localhost:3001';
const TABLE_HEAD = ['Country', 'Currencies', ''];
const REVERSED_TABLE_HEAD = ['Currency', 'Countries', ''];

export default function Home() {
  const [reversedView, setReversedView] = useState(false);
  const [allCountries, setAllCountries] = useState<{
    [key: string]: {
      countries: never;
      currencies: string[];
      disabled: boolean;
    };
  }>({});
  const [allCurrencies, setAllCurrencies] = useState<{
    [key: string]: {
      currencies: never;
      countries: string[];
      disabled: boolean;
    };
  }>({});

  const dataFetcher = () => {
    fetch(API_URI)
      .then((res) => res.json())
      .then((data) => {
        setAllCountries(data.countriesMap);
        setAllCurrencies(data.currenciesMap);
      });
  };

  const handleViewChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setReversedView(event.target.checked);
  };

  const handleStatusChange = async (
    item: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const body: {
      country?: string;
      currency?: string;
      status: boolean;
    } = {
      status: event.target.checked,
    };

    body[reversedView ? 'currency' : 'country'] = item;

    await fetch(`${API_URI}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    dataFetcher();
  };

  useEffect(() => {
    dataFetcher();
  }, []);

  const data = reversedView ? allCurrencies : allCountries;
  const relationField = reversedView ? 'countries' : 'currencies';
  const header = reversedView ? REVERSED_TABLE_HEAD : TABLE_HEAD;

  return (
    <Card className='mx-40 my-10 h-full w-auto' placeholder=''>
      <CardHeader
        floated={false}
        shadow={false}
        className='rounded-none'
        placeholder=''
      >
        <div className='mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center'>
          <div>
            <Typography variant='h5' color='blue-gray' placeholder=''>
              Countries&apos; Currencies Table
            </Typography>
            <Typography
              color='gray'
              className='mt-1 font-normal'
              placeholder={''}
            >
              These are info about countries and there currencies
            </Typography>
          </div>
          <div className='flex w-full shrink-0 gap-2 md:w-max'>
            <Switch
              label={
                <div>
                  <Typography
                    color='blue-gray'
                    className='font-medium'
                    placeholder=''
                  >
                    Revers Relation
                  </Typography>
                  <Typography
                    variant='small'
                    color='gray'
                    className='font-normal'
                    placeholder=''
                  >
                    You can change display to Currency as main row.
                  </Typography>
                </div>
              }
              containerProps={{
                className: '-mt-5',
              }}
              crossOrigin=''
              checked={reversedView}
              onChange={handleViewChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className='overflow-scroll px-0' placeholder=''>
        <table className='w-full min-w-max table-auto text-center'>
          <thead>
            <tr>
              {header.map((head) => {
                return (
                  <th
                    key={head}
                    className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'
                  >
                    <Typography
                      variant='small'
                      color='blue-gray'
                      className='font-normal leading-none opacity-70'
                      placeholder=''
                    >
                      {head}
                    </Typography>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((item, index) => {
              const isLast = index === Object.keys(data).length - 1;
              const classes = isLast
                ? 'p-4'
                : 'p-4 border-b border-blue-gray-50';

              return (
                <tr
                  key={item}
                  className={data[item].disabled ? 'bg-blue-gray-50' : ''}
                >
                  <td className={classes}>
                    <Typography
                      variant='small'
                      color='blue-gray'
                      className='font-normal'
                      placeholder=''
                    >
                      {item}
                    </Typography>
                  </td>
                  <td className={`${classes} max-w-64 break-words`}>
                    <Typography
                      variant='small'
                      color='blue-gray'
                      className='break-words font-normal'
                      placeholder=''
                    >
                      {data[item][relationField].join(', ')}
                    </Typography>
                  </td>

                  <td className={`${classes} w-20 text-left`}>
                    <Switch
                      id={item}
                      onChange={handleStatusChange.bind(null, item)}
                      checked={!data[item].disabled}
                      crossOrigin=''
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
