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
  Code as ChakraCode,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  UnorderedList,
  Code,
  Kbd,
  Textarea
} from '@chakra-ui/react';
import { FaPython, FaCode, FaLightbulb, FaGlobeAmericas, FaCheck, FaTerminal } from 'react-icons/fa';
import { SiPycharm, SiJupyter } from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';

const PythonCourse: React.FC = () => {
  const [code, setCode] = useState('print("¡Hola, Mundo!")');
  const [output, setOutput] = useState('');
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const executeCode = () => {
    try {
      // This is a simple example - in a real app, you'd use a proper Python interpreter
      if (code.includes('print')) {
        const message = code.match(/print\(["'](.*?)["']\)/);
        setOutput(message ? message[1] : '¡Código ejecutado!');
      } else {
        setOutput('¡Código ejecutado!');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al ejecutar el código',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const pythonFacts = [
    'Python fue creado por Guido van Rossum y lanzado en 1991.',
    'El nombre "Python" viene del grupo de comedia británico Monty Python.',
    'Python es uno de los lenguajes de programación más populares del mundo.',
    'Empresas como Google, NASA, y Netflix usan Python en sus productos.',
    'Python tiene una filosofía llamada "El Zen de Python" que guía su diseño.'
  ];

  const realWorldApplications = [
    'Desarrollo web (Django, Flask)',
    'Ciencia de datos y análisis',
    'Inteligencia artificial y aprendizaje automático',
    'Automatización de tareas',
    'Desarrollo de videojuegos',
    'Aplicaciones de escritorio'
  ];

  const codeExamples = {
    variables: 'nombre = "Juan"\nedad = 25\naltura = 1.75\nes_estudiante = True',
    conditionals: 'if edad >= 18:\n    print("Eres mayor de edad")\nelse:\n    print("Eres menor de edad")',
    loops: '# Bucle for\nfor i in range(5):\n    print(f"Número: {i}")\n\n# Bucle while\ncontador = 0\nwhile contador < 3:\n    print(f"Contador: {contador}")\n    contador += 1',
    functions: 'def saludar(nombre):\n    return f"¡Hola, {nombre}!"\n\n# Llamando a la función\nmensaje = saludar("Ana")\nprint(mensaje)'
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <HStack justify="center" mb={4}>
            <FaPython size={48} color="#3776AB" />
            <Heading as="h1" size="2xl" ml={4}>
              Programación en Python
            </Heading>
          </HStack>
          <Text fontSize="xl" color="gray.600">
            Aprende a programar con uno de los lenguajes más populares y versátiles
          </Text>
          <HStack justify="center" mt={4} spacing={4}>
            <Badge colorScheme="green" px={3} py={1} borderRadius="full">
              Nivel Principiante
            </Badge>
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
              6 Semanas
            </Badge>
          </HStack>
        </Box>

        {/* Main Content */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          <GridItem>
            {/* Introducción a Python */}
            <Card mb={6} borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack>
                  <FaCode color="#4A5568" />
                  <Heading size="md">Introducción a Python</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <Text mb={4}>
                  Python es un lenguaje de programación de alto nivel, interpretado y de propósito general. 
                  Su sintaxis clara y legible lo hace ideal para principiantes, mientras que su poder 
                  y versatilidad lo convierten en una herramienta favorita entre desarrolladores 
                  experimentados.
                </Text>
                
                <Text mb={4}>
                  Python fue diseñado con la filosofía de que "lo hermoso es mejor que lo feo" y 
                  "la legibilidad cuenta". Esto significa que el código Python se asemeja al 
                  inglés, lo que facilita su comprensión y escritura.
                </Text>

                <Box 
                  p={4} 
                  bg="blue.50" 
                  borderRadius="md" 
                  borderLeft="4px" 
                  borderColor="blue.500"
                  mb={4}
                >
                  <Text fontWeight="bold" mb={2}>Ejemplo de "Hola Mundo" en Python:</Text>
                  <Code p={2} display="block" my={2} whiteSpace="pre" overflowX="auto">
                    {codeExamples.variables.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </Code>
                  <Text mt={2}>Este código imprime "¡Hola, Mundo!" en la pantalla.</Text>
                </Box>
              </CardBody>
            </Card>

            {/* Entorno de Prueba */}
            <Card mb={6} borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack>
                  <FaTerminal color="#4A5568" />
                  <Heading size="md">Prueba Python Aquí</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <Box w="100%">
                    <Text mb={2}>Escribe tu código Python:</Text>
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      fontFamily="mono"
                      minH="200px"
                      placeholder="Escribe tu código Python aquí..."
                    />
                  </Box>
                  
                  <Button 
                    colorScheme="blue" 
                    onClick={executeCode}
                    leftIcon={<FaTerminal />}
                  >
                    Ejecutar Código
                  </Button>
                  
                  {output && (
                    <Box w="100%" mt={4}>
                      <Text fontWeight="bold" mb={2}>Salida:</Text>
                      <Box 
                        p={4} 
                        bg="gray.50" 
                        borderRadius="md" 
                        borderLeft="4px" 
                        borderColor="gray.400"
                        fontFamily="mono"
                        whiteSpace="pre"
                      >
                        {output}
                      </Box>
                    </Box>
                  )}
                  
                  <Divider my={4} />
                  
                  <Box w="100%">
                    <Heading size="sm" mb={4}>Ejemplos Rápidos</Heading>
                    <Accordion allowToggle>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                              <Text as="span" fontWeight="bold">Variables y Tipos de Datos</Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Code p={2} display="block" my={2} whiteSpace="pre" overflowX="auto">
                            {codeExamples.variables}
                          </Code>
                        </AccordionPanel>
                      </AccordionItem>

                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                              <Text as="span" fontWeight="bold">Condicionales</Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Code p={2} display="block" my={2} whiteSpace="pre" overflowX="auto">
                            {codeExamples.conditionals}
                          </Code>
                        </AccordionPanel>
                      </AccordionItem>

                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                              <Text as="span" fontWeight="bold">Bucles</Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Code p={2} display="block" my={2} whiteSpace="pre" overflowX="auto">
                            {codeExamples.loops}
                          </Code>
                        </AccordionPanel>
                      </AccordionItem>

                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                              <Text as="span" fontWeight="bold">Funciones</Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Code p={2} display="block" my={2} whiteSpace="pre" overflowX="auto">
                            {codeExamples.functions}
                          </Code>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            {/* Aplicaciones de Python */}
            <Card mb={6} borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack>
                  <FaGlobeAmericas color="#4A5568" />
                  <Heading size="md">¿Dónde se usa Python?</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <Text mb={4}>
                  Python es increíblemente versátil y se utiliza en una amplia variedad de dominios:
                </Text>
                
                <UnorderedList spacing={2} mb={6}>
                  {realWorldApplications.map((app, index) => (
                    <ListItem key={index} display="flex" alignItems="center">
                      <ListIcon as={FaCheck} color="green.500" />
                      {app}
                    </ListItem>
                  ))}
                </UnorderedList>
                
                <Text fontWeight="bold" mb={2}>Ejemplo de un caso de uso real:</Text>
                <Box 
                  p={4} 
                  bg="green.50" 
                  borderRadius="md" 
                  borderLeft="4px" 
                  borderColor="green.500"
                >
                  <Text>Una startup de análisis de datos usa Python para procesar grandes cantidades de información de redes sociales. Con solo unas pocas líneas de código, pueden extraer tendencias, analizar sentimientos y generar informes automáticamente, lo que les ahorra cientos de horas de trabajo manual.</Text>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            {/* Beneficios de Aprender Python */}
            <Card mb={6} borderWidth="1px" borderColor={borderColor} position="sticky" top="100px">
              <CardHeader>
                <HStack>
                  <FaLightbulb color="#4A5568" />
                  <Heading size="md">¿Por qué aprender Python?</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontWeight="bold" mb={2}>1. Fácil de Aprender</Text>
                    <Text fontSize="sm">Su sintaxis clara y legible lo hace ideal para principiantes.</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold" mb={2}>2. Alta Demanda Laboral</Text>
                    <Text fontSize="sm">Uno de los lenguajes más solicitados por las empresas.</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold" mb={2}>3. Versatilidad</Text>
                    <Text fontSize="sm">Puedes usarlo para casi cualquier tipo de proyecto.</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold" mb={2}>4. Gran Comunidad</Text>
                    <Text fontSize="sm">Amplia documentación y soporte en línea.</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold" mb={2}>5. Ecosistema Rico</Text>
                    <Text fontSize="sm">Miles de bibliotecas y marcos de trabajo disponibles.</Text>
                  </Box>
                </VStack>
                
                <Divider my={4} />
                
                <Box>
                  <Text fontWeight="bold" mb={2}>Herramientas Populares</Text>
                  <VStack align="stretch" spacing={3} mt={4}>
                    <HStack>
                      <VscCode size={24} color="#007ACC" />
                      <Text>Visual Studio Code</Text>
                    </HStack>
                    <HStack>
                      <SiPycharm size={24} color="#21D789" />
                      <Text>PyCharm</Text>
                    </HStack>
                    <HStack>
                      <SiJupyter size={24} color="#F37626" />
                      <Text>Jupyter Notebook</Text>
                    </HStack>
                  </VStack>
                </Box>
                
                <Divider my={4} />
                
                <Box>
                  <Text fontWeight="bold" mb={2}>Datos Curiosos</Text>
                  <UnorderedList spacing={2}>
                    {pythonFacts.map((fact, index) => (
                      <ListItem key={index} fontSize="sm">{fact}</ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              </CardBody>
              <CardFooter>
                <Button colorScheme="blue" w="full">
                  Comenzar el Curso
                </Button>
              </CardFooter>
            </Card>
            
            {/* Recursos Adicionales */}
            <Card borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Recursos Adicionales</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Button variant="outline" justifyContent="flex-start">
                    Documentación Oficial
                  </Button>
                  <Button variant="outline" justifyContent="flex-start">
                    Ejercicios Prácticos
                  </Button>
                  <Button variant="outline" justifyContent="flex-start">
                    Proyectos para Principiantes
                  </Button>
                  <Button variant="outline" justifyContent="flex-start">
                    Comunidad en Línea
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};

export default PythonCourse;
