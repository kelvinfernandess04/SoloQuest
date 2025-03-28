import React from 'react';
import { FlatList, View, Text, StyleProp, ViewStyle } from 'react-native';
import { CustomListStyles } from '../styles/CustomListStyles';

interface Props<T> {
  data: T[];
  renderItem: ({ item }: { item: T }) => React.ReactElement;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function CustomList<T>({ 
  data, 
  renderItem, 
  keyExtractor, 
  emptyMessage = 'Nenhum item encontrado...', 
  contentContainerStyle 
}: Props<T>) {
  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={[CustomListStyles.contentContainer, contentContainerStyle]}
      ListEmptyComponent={
        <View style={CustomListStyles.emptyContainer}>
          <Text style={CustomListStyles.emptyText}>{emptyMessage}</Text>
        </View>
      }
    />
  );
}