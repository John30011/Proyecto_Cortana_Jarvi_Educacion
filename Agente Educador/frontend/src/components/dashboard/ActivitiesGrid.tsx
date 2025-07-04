import React from 'react';
import { SimpleGrid, Box, Heading, Button, HStack, useColorModeValue } from '@chakra-ui/react';
import ActivityCard from './ActivityCard';
import { getAllActivities } from '../../services/activities';

const ActivitiesGrid = () => {
  const textColor = useColorModeValue('gray.700', 'white');
  const activities = getAllActivities();

  return (
    <Box mb={10}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg" color={textColor}>Actividades Educativas</Heading>
        <Button variant="ghost" colorScheme="blue" size="sm">Ver todas las categorías</Button>
      </HStack>
      
      <SimpleGrid 
        columns={{ base: 1, md: 2, lg: 3, xl: 4 }} 
        spacing={6}
      >
        {activities.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            title={activity.title}
            description={activity.description}
            icon={<Box fontSize="24px">{activity.icon}</Box>}
            color={activity.color}
            path={activity.path}
            difficulty={activity.difficulty}
            duration={activity.duration}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ActivitiesGrid;
