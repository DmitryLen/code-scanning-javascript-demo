import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { useRemToPx } from "../../../hooks/viewModeHooks";
import { APIUrls } from "../../utils/api/api";
import { INSTAGRAM_PROFILE_URL, INSTAGRAM_URL } from "../../constants";
import { getBaseHost } from "../../utils/url/url";
import FeedsSlider from "./FeedsSlider";

const postIdFallback = "CY-fMp4MOzX";
let lastPostId;
const InstagramFeeds = ({ t }) => {
  const remToPx = useRemToPx();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [postId, setPostId] = useState(lastPostId);

  useEffect(() => {
    if (!postId) {
      axios.get(getBaseHost() + window.location.hash)
        .then((response) => {
          if (response.data.data) {
            setPostId(response.data.data);
          } else {
            setPostId(postIdFallback);
          }
        }).catch(() => {
          setPostId(postIdFallback);
        }).finally(() => {
          setIsLoading(false);
        });
    }
  }, [postId]);

  if (isError && !isLoading) {
    return (
      <div className="feeds-instagram-no-data">
        <span>No data</span>
        <h3 className="feeds-header">
          {t("follow_us_on")}
          <a href={INSTAGRAM_PROFILE_URL} rel="nofollow noopener noreferrer" target="_blank">
            {t("instagram")}
          </a>
        </h3>
      </div>
    );
  }

  return (
    <FeedsSlider slotFeedsSlider={(
      <>
        {isLoading && <div className="feeds-instagram-no-data">{t("loading")}…</div>}
        {
          postId && (
            <iframe
              onLoad={() => {
                setIsLoading(false);
              }}
              onError={() => {
                setIsError(true);
              }}
              width={remToPx(16)}
              height={remToPx(18.7)}
              src={INSTAGRAM_URL + "/p/" + postId + "/embed"}
              frameBorder="0"
            />
          )
        }
      </>
    )}/>
  );
};

InstagramFeeds.propTypes = {
  t: PropTypes.func.isRequired
};

export default InstagramFeeds;
