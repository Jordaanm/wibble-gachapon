import * as React from 'react';
import useGoogleSheets from 'use-google-sheets';

const SHEET_ID = '1SMNUUcvnPhguyH098bSLBnf6HAWFcElhhkaS0zzcPbw';
const API_KEY = 'AIzaSyAM91dTOHYfIKe8uTNTT4RFe1i0LGLve8s';

export interface SheetDataLoaderProps<T> {
  processData(data: any): T;
  render(data: T): React.ReactElement<any>;
}

export function SheetDataLoader<T> (props: SheetDataLoaderProps<T>) {
  const{ processData, render } = props;
  const { data, loading, error } = useGoogleSheets({
    apiKey: API_KEY,
    sheetId: SHEET_ID
  });

  if (loading) {
    return <div>Loading</div>
  }

  if(error) {
    return <div>Error!</div>
  }

  const output = processData(data);
  return render(output);
};

