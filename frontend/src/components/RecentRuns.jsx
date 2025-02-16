import { useState, useEffect } from 'react';
import { Title, Table, Text, Loader } from '@mantine/core';
import runService from '../services/runService';

export default function RecentRuns() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const data = await runService.getAllRuns();
        setRuns(data.slice(0, 5)); // Get only the 5 most recent runs
      } catch (err) {
        console.error('Error fetching runs:', err);
        setError('Failed to load recent runs');
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Text color="red">{error}</Text>;
  if (runs.length === 0) return <Text color="dimmed">No recent runs</Text>;

  return (
    <>
      <Title order={2} size="h3" mb="md">Recent Runs</Title>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Distance</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Location</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {runs.map(run => (
            <Table.Tr key={run.id}>
              <Table.Td>{new Date(run.date).toLocaleDateString()}</Table.Td>
              <Table.Td>{run.distance} {run.distance_unit}</Table.Td>
              <Table.Td>{run.type}</Table.Td>
              <Table.Td>{run.location}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
} 