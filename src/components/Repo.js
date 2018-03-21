import React from 'react';
import {View, Text, Linking, Button, StyleSheet, Image} from 'react-native';
import gql from 'graphql-tag';
import {graphql, compose} from 'react-apollo';
import Language, {LANGUAGE_FRAGMENT} from './Language';

const Repo = ({repo, unstarMutation, starMutation}) => (
  <View style={styles.card}>
    <WebLink href={repo.url}>{repo.name}</WebLink>
    <Text>{repo.description}</Text>

    {repo.viewerHasStarred ? (
      <ToggleStarButton mutation={unstarMutation} repo={repo} text="UnStar" />
    ) : (
      <ToggleStarButton mutation={starMutation} repo={repo} text="Star" />
    )}

    <View style={styles.detailsRow}>
      <Language language={repo.primaryLanguage} style={styles.detail} />
      <Text style={[styles.withIcon, styles.detail]}>
        <Icon source={require('./forked.png')} />
        {repo.forkCount}
      </Text>
      <Text style={[styles.withIcon, styles.detail]}>
        <Icon source={require('./star.png')} />
        {repo.stargazers.totalCount}
      </Text>
    </View>
  </View>
);

const Icon = ({source}) => <Image source={source} style={styles.icon} />;

const ToggleStarButton = ({mutation, repo, text}) => (
  <Button
    title={text}
    onPress={() => mutation({variables: {repoId: repo.id}})}
  />
);

const WebLink = ({href, children}) => (
  <Text style={styles.repoTitle} onPress={() => Linking.openURL(href)}>
    {children}
  </Text>
);

export const REPO_FRAGMENT = gql`
  fragment Repo on Repository {
    id
    url
    name
    description
    forkCount
    viewerHasStarred
    stargazers {
      totalCount
    }
    primaryLanguage {
      ...Language
    }
  }

  ${LANGUAGE_FRAGMENT}
`;

const STAR_MUTATION = gql`
  mutation StarRepo($repoId: ID!) {
    addStar(input: {starrableId: $repoId}) {
      starrable {
        ...Repo
      }
    }
  }
  ${REPO_FRAGMENT}
`;

const UNSTAR_MUTATION = gql`
  mutation StarRepo($repoId: ID!) {
    removeStar(input: {starrableId: $repoId}) {
      starrable {
        ...Repo
      }
    }
  }
  ${REPO_FRAGMENT}
`;

const styles = StyleSheet.create({
  card: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
    padding: 5,
    marginVertical: 10,
  },
  detailsRow: {
    flexDirection: 'row',
  },
  detail: {
    marginRight: 10,
  },
  repoTitle: {
    color: '#0366d6',
    fontSize: 24,
  },
  icon: {
    width: 16,
    height: 16,
  },
  withIcon: {
    flexDirection: 'row',
  },
});

const withStarMutation = graphql(STAR_MUTATION, {name: 'starMutation'});
const withUnstarMutation = graphql(UNSTAR_MUTATION, {name: 'unstarMutation'});

export default compose(withStarMutation, withUnstarMutation)(Repo);
