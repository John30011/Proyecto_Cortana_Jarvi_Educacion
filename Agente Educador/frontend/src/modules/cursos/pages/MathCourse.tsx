import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  InputGroup,
  InputLeftAddon,
  useToast,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  UnorderedList,
  Code,
  Stack,
  SimpleGrid
} from '@chakra-ui/react';
import { FaCalculator, FaHistory, FaLightbulb, FaGlobe, FaBook, FaGamepad, FaYoutube, FaCheck } from 'react-icons/fa';

const MathCourse: React.FC = () => {
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [result, setResult] = useState<number | string>('');
  const [activeOperation, setActiveOperation] = useState<string>('');
  const toast = useToast();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');

  const calculate = (operation: string) => {
    if (isNaN(num1) || isNaN(num2)) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa números válidos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setActiveOperation(operation);
    
    switch(operation) {
      case 'add':
        setResult(num1 + num2);
        break;
      case 'subtract':
        setResult(num1 - num2);
        break;
      case 'multiply':
        setResult(num1 * num2);
        break;
      case 'divide':
        if (num2 === 0) {
          setResult('No se puede dividir por cero');
        } else {
          setResult((num1 / num2).toFixed(2));
        }
        break;
      default:
        setResult('');
    }
  };

  const mathFacts = [
    'El número π (pi) tiene infinitos decimales sin patrón repetitivo.',
    'El cero fue inventado en la India alrededor del siglo V d.C.',
    'El símbolo de igualdad "=" fue inventado en 1557 por Robert Recorde.',
    'El número más grande con un nombre propio es el gúgolplex (10^gúgol).',
    'Las matemáticas son el único lenguaje común a todas las culturas humanas.'
  ];

  const dailyMathUses = [
    'Presupuestos personales y finanzas',
    'Cocinar y medir ingredientes',
    'Compras y comparación de precios',
    'Tiempo y programación',
    'Medición de distancias y áreas',
    'Deportes y estadísticas',
    'Viajes y navegación'
  ];

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header Section */}
      <VStack spacing={6} align="stretch" mb={10}>
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4} color="blue.600">
            Matemáticas Básicas
          </Heading>
          <HStack spacing={4} justify="center" mb={4}>
            <Badge colorScheme="green" p={2} borderRadius="md">
              Nivel: Principiante
            </Badge>
            <Badge colorScheme="purple" p={2} borderRadius="md">
              Duración: 4 semanas
            </Badge>
          </HStack>
          <Text fontSize="lg" color="gray.600">
            Domina los conceptos fundamentales de las matemáticas y descubre cómo se aplican en la vida diaria.
          </Text>
        </Box>
      </VStack>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        {/* Main Content */}
        <GridItem>
          {/* History of Mathematics */}
          <Card mb={6} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack>
                <FaHistory color="#4A5568" />
                <Heading size="md">Historia de las Matemáticas</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text mb={4}>
                Las matemáticas han sido fundamentales para el desarrollo de la humanidad desde las primeras civilizaciones. 
                Los antiguos egipcios y babilonios desarrollaron sistemas numéricos y métodos para resolver problemas prácticos 
                como la medición de tierras y el comercio.
              </Text>
              <Text mb={4}>
                Los griegos, con figuras como Pitágoras, Euclides y Arquímedes, sentaron las bases de la geometría y el 
                razonamiento matemático. Durante la Edad de Oro islámica, matemáticos como Al-Khwarizmi (cuyo nombre dio origen 
                a la palabra "algoritmo") hicieron contribuciones significativas al álgebra.
              </Text>
              <Text>
                En la actualidad, las matemáticas son el lenguaje universal de la ciencia y la tecnología, con aplicaciones 
                en prácticamente todos los aspectos de la vida moderna.
              </Text>
            </CardBody>
          </Card>

          {/* Interactive Calculator */}
          <Card mb={6} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack>
                <FaCalculator color="#4A5568" />
                <Heading size="md">Calculadora Interactiva</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                  <Box>
                    <Text mb={2}>Primer número:</Text>
                    <Input
                      type="number"
                      value={num1}
                      onChange={(e) => setNum1(Number(e.target.value))}
                      placeholder="Ingresa un número"
                    />
                  </Box>
                  <Box>
                    <Text mb={2}>Segundo número:</Text>
                    <Input
                      type="number"
                      value={num2}
                      onChange={(e) => setNum2(Number(e.target.value))}
                      placeholder="Ingresa un número"
                    />
                  </Box>
                </SimpleGrid>

                <HStack spacing={4} wrap="wrap" justify="center">
                  <Button 
                    colorScheme="blue" 
                    leftIcon={<Text>+</Text>}
                    onClick={() => calculate('add')}
                    isActive={activeOperation === 'add'}
                  >
                    Sumar
                  </Button>
                  <Button 
                    colorScheme="red" 
                    leftIcon={<Text>-</Text>}
                    onClick={() => calculate('subtract')}
                    isActive={activeOperation === 'subtract'}
                  >
                    Restar
                  </Button>
                  <Button 
                    colorScheme="green" 
                    leftIcon={<Text>×</Text>}
                    onClick={() => calculate('multiply')}
                    isActive={activeOperation === 'multiply'}
                  >
                    Multiplicar
                  </Button>
                  <Button 
                    colorScheme="purple" 
                    leftIcon={<Text>÷</Text>}
                    onClick={() => calculate('divide')}
                    isActive={activeOperation === 'divide'}
                  >
                    Dividir
                  </Button>
                </HStack>

                {result !== '' && (
                  <Box 
                    p={4} 
                    bg="blue.50" 
                    borderRadius="md" 
                    borderLeft="4px" 
                    borderColor="blue.500"
                    w="100%"
                  >
                    <Text fontWeight="bold">Resultado: <Text as="span" color="blue.600">{result}</Text></Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Math in Daily Life */}
          <Card mb={6} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack>
                <FaGlobe color="#4A5568" />
                <Heading size="md">Matemáticas en la Vida Diaria</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text mb={4}>
                Las matemáticas están presentes en casi todas las actividades que realizamos a diario, aunque a veces no nos demos cuenta. 
                Aquí hay algunos ejemplos de cómo usamos las matemáticas en la vida cotidiana:
              </Text>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                {dailyMathUses.map((use, index) => (
                  <HStack key={index} align="flex-start">
                    <Box color="green.500" mt={1}>
                      <FaCheck size={14} />
                    </Box>
                    <Text>{use}</Text>
                  </HStack>
                ))}
              </SimpleGrid>

              <Box mt={6} p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="bold" mb={2}>Ejemplo Práctico:</Text>
                <Text>
                  Imagina que vas al supermercado con $100. Compras alimentos por $45 y productos de limpieza por $28. 
                  ¿Cuánto dinero te sobra?
                </Text>
                <Text mt={2} fontWeight="bold">
                  Solución: $100 - $45 - $28 = $27
                </Text>
                <Text mt={2}>¡Te sobrarían $27!</Text>
              </Box>
            </CardBody>
          </Card>
        </GridItem>

        {/* Sidebar */}
        <GridItem>
          {/* Benefits of Learning Math */}
          <Card mb={6} borderWidth="1px" borderColor={borderColor} position="sticky" top="20px">
            <CardHeader>
              <HStack>
                <FaLightbulb color="#4A5568" />
                <Heading size="md">Beneficios de Aprender Matemáticas</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold" mb={1}>1. Desarrollo del Pensamiento Lógico</Text>
                  <Text fontSize="sm">Las matemáticas enseñan a pensar de manera ordenada y a resolver problemas paso a paso.</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" mb={1}>2. Mejora la Capacidad de Análisis</Text>
                  <Text fontSize="sm">Ayudan a analizar información, identificar patrones y tomar decisiones basadas en datos.</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" mb={1}>3. Esencial para el Éxito Académico</Text>
                  <Text fontSize="sm">Son fundamentales en ciencias, tecnología, ingeniería y muchas otras disciplinas.</Text>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" mb={1}>4. Aplicaciones Prácticas</Text>
                  <Text fontSize="sm">Desde administrar tu dinero hasta cocinar, las matemáticas son útiles en la vida diaria.</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Fun Math Facts */}
          <Card mb={6} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Datos Curiosos</Heading>
            </CardHeader>
            <CardBody>
              <UnorderedList spacing={2}>
                {mathFacts.map((fact, index) => (
                  <ListItem key={index} fontSize="sm">
                    {fact}
                  </ListItem>
                ))}
              </UnorderedList>
            </CardBody>
          </Card>

          {/* Additional Resources */}
          <Card borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Recursos Adicionales</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <Button leftIcon={<FaBook />} variant="outline" justifyContent="flex-start">
                  Guía de Ejercicios
                </Button>
                <Button leftIcon={<FaYoutube />} variant="outline" justifyContent="flex-start">
                  Video Tutoriales
                </Button>
                <Button leftIcon={<FaGamepad />} variant="outline" justifyContent="flex-start">
                  Juegos Matemáticos
                </Button>
                <Button leftIcon={<FaBook />} variant="outline" justifyContent="flex-start">
                  Pruebas de Práctica
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default MathCourse;
