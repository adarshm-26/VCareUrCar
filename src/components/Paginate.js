import React from 'react';
import { Pagination } from 'react-bootstrap';

export const Paginate = (props) => {
  return (
    <>
    {
      !props.content.empty ?
      <Pagination style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
      }}>
        <Pagination.Prev
          onClick={() => {
            if (props.pageNo !== 0) {
              props.setPage(props.pageNo-1);
              props.callback();
            }
          }} 
          disabled={props.pageNo === 0}/>
        <Pagination.Item active>
          {props.pageNo+1}
        </Pagination.Item>
        <Pagination.Next
          onClick={() => {
            if (props.pageNo !== props.content.totalPages-1) {
              props.setPage(props.pageNo+1);
              props.callback();
            }
          }} 
          disabled={props.pageNo === props.content.totalPages-1}/>
      </Pagination> : <></>
    }
    </>
  );
}