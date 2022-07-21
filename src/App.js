import React, { useState, useRef, useReducer, useEffect } from "react";
import "./styles.css";
import { getImageList } from "./apis";
import { morePage } from "./constants";
import useInfiniteScroll from "./useInfiniteScroll";
import LoadingSpinner from "./LoadingSpinner";

const getImageListContent = async (page, contentDispatch, pageDispatch) => {
  // setIsLoading(true);
  contentDispatch({ type: fetchingStatus, fetching: true });
  getImageList(page, 20)
    .then((response) => {
      const { status, data = [] } = response;
      if (status === 200) {
        contentDispatch({ type: stackContent, imgs: data });
      }
    })
    .catch((err) => {
      pageDispatch({ type: retreatPage });
      console.error(err);
      return err;
    })
    .finally(() => {
      contentDispatch({ type: fetchingStatus, fetching: false });
      // setIsLoading(false);
    });
};

const ImageContentList = ({ list }) => {
  return (
    <div className="contentList">
      {list.map((item, index) => (
        <div key={index}>
          <img src={item.download_url} alt={item.id} />
        </div>
      ))}
    </div>
  );
};

const stackContent = "STACK";
const fetchingStatus = "FETCHING_STATUS";
const imgReducer = (state, action) => {
  switch (action.type) {
    case stackContent:
      return { ...state, imgs: state.imgs.concat(action.imgs) };
    case fetchingStatus:
      return { ...state, fetching: action.fetching };
    default:
      return state;
  }
};

const retreatPage = "RETREAT_PAGE";
const pageReducer = (state, action) => {
  switch (action.type) {
    case morePage:
      return state + 1;
    case retreatPage:
      return state - 1;
    default:
      return state;
  }
};

const useFetchImg = (page, imgDispatch, pageDispatch) => {
  useEffect(() => {
    getImageListContent(page, imgDispatch, pageDispatch);
  }, [page, imgDispatch, pageDispatch]);
};

export default function App() {
  const [page, pageDispatch] = useReducer(pageReducer, 1);
  const [imgData, imgDispatch] = useReducer(imgReducer, {
    imgs: [],
    fetching: true
  });
  // const [isLoading, setIsLoading] = useState(false);
  const bottomBoundaryRef = useRef(null);
  const isBottomBoundaryExist =
    imgData.fetching === false && imgData.imgs.length > 0;

  useFetchImg(page, imgDispatch, pageDispatch);
  useInfiniteScroll(bottomBoundaryRef, pageDispatch, imgData.fetching);

  return (
    <div className="App">
      <div className="contentListWrapper">
        <ImageContentList list={imgData.imgs} />
      </div>
      {imgData.fetching === true && (
        <div style={{ position: "relative" }}>
          <LoadingSpinner type="chase" />
        </div>
      )}
      {isBottomBoundaryExist && (
        <div
          ref={bottomBoundaryRef}
          style={{ width: "100%", border: "1px solid transparent" }}
        ></div>
      )}
    </div>
  );
}
