import React from 'react';
import { Box, Heading, Text, Badge, Flex, Icon, useColorModeValue, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  to: string;
  count: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon,
  color,
  to,
  count
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as={RouterLink}
      to={to}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
        borderColor: color,
      }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Flex mb={4} align="center">
        <Box
          p={3}
          rounded="full"
          bg={`${color}.50`}
          color={color}
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          mr={4}
        >
          {React.cloneElement(icon, { size: 24 })}
        </Box>
        <Box>
          <Heading size="md" mb={1} color={useColorModeValue('gray.800', 'white')}>
            {title}
          </Heading>
          <Badge colorScheme={color} variant="subtle">
            {count} {count === 1 ? 'curso' : 'cursos'}
          </Badge>
        </Box>
      </Flex>
      
      <Text color={textColor} flex={1} mb={4}>
        {description}
      </Text>
      
      <Flex align="center" color={color} fontWeight="medium" mt="auto">
        Explorar categoría
        <Icon viewBox="0 0 20 20" fill="currentColor" ml={2} boxSize={4}>
          <path
            fillRule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </Icon>
      </Flex>
    </Box>
  );
};

export default CategoryCard;
