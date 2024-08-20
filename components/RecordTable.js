import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const Table = styled(View, 'w-full');
const TableHeader = styled(View, 'flex-row justify-around bg-Primary p-2');
const TableHeaderText = styled(Text, 'text-Text font-bold text-lg');
const TableRow = styled(View, 'flex-row justify-around p-2 border-b border-Separator');
const TableText = styled(Text, 'text-Text text-base');

const RecordTable = ({ items }) => (
  <Table>
    <TableHeader>
      <TableHeaderText>Exercise</TableHeaderText>
      <TableHeaderText>Max Weight (kg)</TableHeaderText>
      <TableHeaderText>Date</TableHeaderText>
    </TableHeader>
    {items.map((item) => (
      <TableRow key={item.exercise_id}>
        <TableText>{item.exercises.name}</TableText>
        <TableText>{item.weight}</TableText>
        <TableText>{new Date(item.completed_at).toLocaleDateString()}</TableText>
      </TableRow>
    ))}
  </Table>
);

export default RecordTable;
