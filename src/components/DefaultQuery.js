import React from 'react';
import {Query} from 'react-apollo';
import {View, Text} from 'react-native';

const DefaultQuery = ({query, variables = {}, children}) => (
  <Query query={query} variables={variables}>
    {({loading, error, data, fetchMore}) => {
      if (loading)
        return (
          <View>
            <Text>loading...</Text>
          </View>
        );
      if (error)
        return (
          <View>
            <Text>{`Error!: ${error}`}</Text>
          </View>
        );

      return children({data, fetchMore});
    }}
  </Query>
);

export default DefaultQuery;
