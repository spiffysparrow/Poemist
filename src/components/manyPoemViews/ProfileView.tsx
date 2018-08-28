import * as React from "react";
import * as moment from "moment";
import IndexView from "src/components/manyPoemViews/IndexView";

import { Query } from "react-apollo";
import gql from "graphql-tag";
import { RouteComponentProps } from "react-router";
import { IUser } from "../types";

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      sessionToken
      poemsWrittenCount
      createdAt
    }
    current {
      id
    }
  }
`;

const ProfileHeaderWData = ({ id }: { id: number }) => (
  <Query query={GET_USER} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return <ProfileHeader {...data} />;
    }}
  </Query>
);

const ProfileHeader = ({ user, current }: { user: IUser; current: IUser }) => {
  const isCurrentUser = current && current.id === user.id;
  const pronoun = isCurrentUser ? "you" : "they";
  const poemsWrittenCount = user && user.poemsWrittenCount;
  const createdAt = user && moment(user.createdAt).fromNow();
  return (
    <div className="mx-3">
      <h1>{user && user.username}</h1>
      <div>
        Poems Written: <strong>{poemsWrittenCount}</strong>
      </div>
      <div>
        Signed Up: <strong>{createdAt}</strong>
      </div>
      <h5>Look at all the lovely poems {pronoun} have written!</h5>
    </div>
  );
};

class ProfileView extends React.PureComponent<
  RouteComponentProps<{ id: number }>
> {
  render() {
    const userId = this.props.match.params.id;
    return (
      <div className="index-view">
        <ProfileHeaderWData id={userId} />
        <IndexView userId={userId} />
      </div>
    );
  }
}

export default ProfileView;