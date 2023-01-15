import React from "react";
import { MatchType } from "../game/matching";
import classNames, { Mapping } from "classnames";

type Props = React.PropsWithChildren<{
  tag?: string;
  match?: MatchType;
  input?: boolean;
  invalid?: boolean;
}>;

/**
 * A block representing a phoneme, possibly as input or with a match assigned.
 */
export default function Block({ tag, match, input, invalid, children }: Props) {
  const classes: Mapping = { "block": true, input, invalid };
  if (match) {
    classes[match] = !!match;
  }
  return (
    <div className={classNames(classes)}>
      {tag ? <span className="tag">{tag}</span> : null}
      {children}
    </div>
  );
}
