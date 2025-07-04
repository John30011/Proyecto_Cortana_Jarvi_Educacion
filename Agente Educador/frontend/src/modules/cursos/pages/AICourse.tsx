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
  useToast,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  UnorderedList,
  Code,
  Stack,
  SimpleGrid,
  Image,
  Link,
  Tag,
  TagLabel,
  TagLeftIcon,
  Flex
} from '@chakra-ui/react';
import { FaRobot, FaBrain, FaCode, FaLaptopCode, FaChartLine, FaGraduationCap, FaHistory, FaLightbulb, FaGlobe, FaBook, FaGamepad, FaYoutube, FaCheck } from 'react-icons/fa';
import { SiTensorflow, SiPytorch, SiOpenai, SiGooglecloud } from 'react-icons/si';

const AICourse: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const toast = useToast();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const highlightColor = useColorModeValue('blue.500', 'blue.300');

  const aiApplications = [
    'Reconocimiento de imágenes y visión por computadora',
    'Procesamiento de lenguaje natural (chatbots, traducción)',
    'Sistemas de recomendación',
    'Vehículos autónomos',
    'Diagnóstico médico asistido',
    'Detección de fraude',
    'Análisis predictivo'
  ];

  const aiFrameworks = [
    { name: 'TensorFlow', icon: <SiTensorflow color="#FF6F61" /> },
    { name: 'PyTorch', icon: <SiPytorch color="#EE4C2C" /> },
    { name: 'OpenAI', icon: <SiOpenai /> },
    { name: 'Google Cloud AI', icon: <SiGooglecloud color="#4285F4" /> }
  ];

  const learningPath = [
    'Fundamentos de programación en Python',
    'Matemáticas para IA (Álgebra lineal, Cálculo, Estadística)',
    'Aprendizaje automático básico',
    'Redes neuronales y aprendizaje profundo',
    'Procesamiento de lenguaje natural',
    'Visión por computadora',
    'Proyectos prácticos'
  ];

  const aiFacts = [
    'El término "Inteligencia Artificial" fue acuñado en 1956 por John McCarthy.',
    'El aprendizaje profundo está inspirado en la estructura del cerebro humano.',
    'La IA puede analizar grandes cantidades de datos mucho más rápido que los humanos.',
    'Los sistemas de IA pueden aprender de sus errores y mejorar con el tiempo.',
    'La IA se utiliza en aplicaciones cotidianas como asistentes de voz y recomendaciones de contenido.'
  ];

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header Section */}
      <VStack spacing={6} align="stretch" mb={10}>
        <Box textAlign="center">
          <HStack spacing={4} justify="center" mb={4}>
            <FaRobot size={40} color={highlightColor} />
            <Heading as="h1" size="2xl" color={highlightColor}>
              Inteligencia Artificial
            </Heading>
          </HStack>
          <HStack spacing={4} justify="center" mb={4}>
            <Badge colorScheme="purple" p={2} borderRadius="md">
              Nivel: Intermedio
            </Badge>
            <Badge colorScheme="green" p={2} borderRadius="md">
              Duración: 8 semanas
            </Badge>
          </HStack>
          <Text fontSize="lg" color="gray.600">
            Domina los conceptos fundamentales de la Inteligencia Artificial y aprende a crear soluciones innovadoras.
          </Text>
        </Box>
      </VStack>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        {/* Main Content */}
        <GridItem>
          {/* Overview */}
          <Card mb={6} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack>
                <FaBrain color="#4A5568" />
                <Heading size="md">¿Qué es la Inteligencia Artificial?</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>
                  La Inteligencia Artificial (IA) es una rama de la informática que se enfoca en crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana, como el aprendizaje, el razonamiento y la percepción.
                </Text>
                <Text>
                  La IA está transformando industrias enteras, desde la salud hasta las finanzas, y está creando nuevas oportunidades para la innovación y el crecimiento económico.
                </Text>
                
                <Box mt={4}>
                  <Heading size="sm" mb={3}>Aplicaciones de la IA:</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    {aiApplications.map((app, index) => (
                      <HStack key={index} align="flex-start">
                        <Box color="green.500" mt={1}>
                          <FaCheck size={14} />
                        </Box>
                        <Text fontSize="sm">{app}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Learning Path */}
          <Card mb={6} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack>
                <FaGraduationCap color="#4A5568" />
                <Heading size="md">Ruta de Aprendizaje</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <List spacing={3}>
                  {learningPath.map((item, index) => (
                    <ListItem key={index} display="flex" alignItems="center">
                      <ListIcon as={FaCheck} color="green.500" />
                      {item}
                    </ListItem>
                  ))}
                </List>
              </VStack>
            </CardBody>
          </Card>

          {/* AI in Action */}
          <Card mb={6} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack>
                <FaLaptopCode color="#4A5568" />
                <Heading size="md">IA en Acción</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={6}>
                <Box>
                  <Text fontWeight="bold" mb={2}>Ejemplo de Código Simple</Text>
                  <Code p={4} w="100%" display="block" borderRadius="md" bg={useColorModeValue('gray.100', 'gray.700')}>
                    {`# Ejemplo de red neuronal simple con TensorFlow/Keras
import tensorflow as tf
from tensorflow import keras

# Cargar datos de ejemplo (MNIST)
mnist = keras.datasets.mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# Normalizar los datos
x_train = x_train / 255.0
x_test = x_test / 255.0

# Crear el modelo
model = keras.Sequential([
    keras.layers.Flatten(input_shape=(28, 28)),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])

# Compilar el modelo
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Entrenar el modelo
model.fit(x_train, y_train, epochs=5)`}
                  </Code>
                </Box>
                
                <Box w="100%">
                  <Text fontWeight="bold" mb={2}>Ética en IA</Text>
                  <Text>
                    A medida que la IA se vuelve más poderosa, es crucial considerar sus implicaciones éticas. Temas como el sesgo algorítmico, la privacidad de datos y el impacto en el empleo son aspectos importantes a considerar en el desarrollo de sistemas de IA.
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Sidebar */}
        <GridItem>
          {/* Frameworks */}
          <Card mb={6} borderWidth="1px" borderColor={borderColor} position="sticky" top="20px">
            <CardHeader>
              <HStack>
                <FaCode color="#4A5568" />
                <Heading size="md">Frameworks Populares</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {aiFrameworks.map((framework, index) => (
                  <HStack key={index} p={3} bg={bgColor} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                    <Box fontSize="24px">
                      {framework.icon}
                    </Box>
                    <Text fontWeight="medium">{framework.name}</Text>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* AI Facts */}
          <Card mb={6} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack>
                <FaLightbulb color="#4A5568" />
                <Heading size="md">Datos Curiosos</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <UnorderedList spacing={2}>
                {aiFacts.map((fact, index) => (
                  <ListItem key={index} fontSize="sm" mb={2}>
                    {fact}
                  </ListItem>
                ))}
              </UnorderedList>
            </CardBody>
          </Card>

          {/* Career Opportunities */}
          <Card mb={6} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack>
                <FaChartLine color="#4A5568" />
                <Heading size="md">Oportunidades Laborales</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={1}>Ingeniero de Aprendizaje Automático</Text>
                  <Text fontSize="sm">Salario promedio: $120,000 - $180,000</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={1}>Científico de Datos</Text>
                  <Text fontSize="sm">Salario promedio: $110,000 - $160,000</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={1}>Ingeniero de Visión por Computadora</Text>
                  <Text fontSize="sm">Salario promedio: $130,000 - $200,000</Text>
                </Box>
              </VStack>
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
                  Libros Recomendados
                </Button>
                <Button leftIcon={<FaYoutube />} variant="outline" justifyContent="flex-start">
                  Tutoriales en Video
                </Button>
                <Button leftIcon={<FaGamepad />} variant="outline" justifyContent="flex-start">
                  Proyectos Prácticos
                </Button>
                <Button leftIcon={<FaGraduationCap />} variant="outline" justifyContent="flex-start">
                  Cursos Avanzados
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default AICourse;
