import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import DataTable from '../../components/DataTable';
import HistoryForm from '../../components/HistoryForm';
import Dashboard from '../../components/Dashboard';
import { getHistory } from '../../utils/History';
import tryCatch from '../../utils/tryCatch';

function History() {
  async function handleFormSubmit(data) {
    console.log('data: ', data);
    const [err, history] = await tryCatch(getHistory(data));

    if (err) {
      console.log('err: ', err);
    }

    console.log('history: ', history);
  }

  return (
    <Dashboard>
      <Fragment>
        <Grid container>
          <Grid item xs={12} sm={4}>
            <HistoryForm onSubmit={handleFormSubmit} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <DataTable
              headers={['sno', 'Object', 'Changed By', 'Date', 'Data Version']}
              items={[]}
              renderRow={() => (
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>5</TableCell>
                </TableRow>
              )}
            />
          </Grid>
        </Grid>
      </Fragment>
    </Dashboard>
  );
}

export default History;
