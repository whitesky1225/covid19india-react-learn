import React, { lazy, Suspense,useState } from "react";
import { Helmet } from "react-helmet";
import useStickySWR from '../hooks/useStickySWR'
import { fetcher } from "../utils/commonFunctions";
import {API_ROOT_URL} from '../constants';

const Footer = lazy(() => import("./Footer"));
const Search = lazy(() => import("./Search"));
const Actions = lazy(()=>import('./Actions'))
function Home() {
  const [date,setDate] = useState('')
  const {data: timeseries} = useStickySWR(
    `${API_ROOT_URL}/timeseries.min.json`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );
  console.log('useStickySWR',timeseries)
  return (
    <React.Fragment>
      <Helmet>
        <title>Coronavirus Outbreak in India - covid19india.org</title>
        <meta
          name="title"
          content="Coronavirus Outbreak in India: Latest Map and Case Count"
        />
      </Helmet>
      <div className="Home">
        <div className="home-left">
          <div className="header">
            <Suspense fallback={<div />}>
              <Search />
            </Suspense>

            {timeseries && (
              <Suspense fallback={<div style={{minHeight: '56px'}} />}>
                <Actions {...{setDate,
                  // dates:Object.keys(timeseries['TT']?.dates).reverse(),  
                  dates:Object.keys(timeseries['TT'].dates).reverse()
                  }}/>
              </Suspense>
            )}
          </div>

          <div style={{ position: "relative" }}>
            {/* {data && (
              <Suspense fallback={<div style={{height: '50rem'}} />}>
                {width > 769 && (
                  <MapSwitcher {...{mapStatistic, setMapStatistic}} />
                )}
                <Level data={data['TT']} />
              </Suspense>
            )}

            {timeseries && (
              <Suspense fallback={<div style={{height: '50rem'}} />}>
                <Minigraphs timeseries={timeseries['TT']} {...{date}} />
              </Suspense>
            )} */}
          </div>

          {/* {data && (
            <Suspense fallback={<div />}>
              <Table {...{data, regionHighlighted, setRegionHighlighted}} />
            </Suspense>
          )} */}
        </div>
      </div>

      <Suspense fallback={<div />}>
        <Footer />
      </Suspense>
    </React.Fragment>
  );
}

export default Home;
