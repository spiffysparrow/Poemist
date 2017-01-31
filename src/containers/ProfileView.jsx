import React from 'react';
import { connect } from 'react-redux';
import { filter } from 'lodash';
import { getUserPoems } from 'src/actions/ajax/poem';
import { values } from 'lodash';
import IndexView from 'src/containers/IndexView.js';

class ProfileView extends React.Component {
  componentWillReceiveProps(newProps) {
    const { userId, getUserPoems } = this.props;
    if (!userId && newProps.userId) {
      getUserPoems({ userId: newProps.userId, page: 1 });
    }
  }
  render() {
    const { poems } = this.props;
    return (
      <div className="index-view">
        <IndexView poems={poems} />
      </div>
    );
  }
}

ProfileView.propTypes = {
  poems: React.PropTypes.array,
  getUserPoems: React.PropTypes.func,
};

const mapDispatchToProps = {
  getUserPoems,
};

function mapStateToProps(state) {
  const userId = state.current.userId;
  let poems;
  if (userId) {
    poems = filter(state.poems, { authorId: userId });
  }
  return {
    poems,
    userId: state.current.userId,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);