# language: es
Feature: Búsqueda de libros en DemoQA BookStore
  Como usuario del sistema
  Quiero buscar libros por palabras clave
  Para encontrar libros de mi interés rápidamente

  Background:
    Given que estoy en la página del catálogo de libros

  Scenario: Búsqueda exitosa con palabra clave existente
    When busco el libro con la palabra clave "Git"
    Then debería ver al menos un resultado de búsqueda
    And los resultados deberían contener el título "Git Pocket Guide"

  Scenario: Búsqueda con palabra clave que devuelve múltiples resultados
    When busco el libro con la palabra clave "JavaScript"
    Then debería ver más de un resultado de búsqueda
    And todos los resultados deberían contener "JavaScript" en su título o autor

  Scenario: Búsqueda con palabra clave inexistente
    When busco el libro con la palabra clave "ISTQB Fundamentals"
    Then no debería ver resultados de búsqueda
    And debería ver la tabla sin filas de datos

  Scenario: Búsqueda con campo vacío muestra todos los libros
    Given que he realizado una búsqueda previa
    When limpio el campo de búsqueda
    Then debería ver todos los libros disponibles en el catálogo

  Scenario Outline: Validación de búsqueda con diferentes términos
    When busco el libro con la palabra clave "<termino>"
    Then el resultado de búsqueda debería ser "<resultado>"

    Examples:
      | termino              | resultado    |
      | Git                  | encontrado   |
      | JavaScript           | encontrado   |
      | Speaking             | encontrado   |
      | ISTQB Fundamentals   | no encontrado|
      | TerminoQueNoExiste   | no encontrado|
      | 12345XYZ             | no encontrado|
