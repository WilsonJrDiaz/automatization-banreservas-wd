# language: es
Feature: Autenticación de usuarios en DemoQA BookStore
  Como usuario del sistema
  Quiero iniciar sesión en la plataforma
  Para acceder a mis libros y colecciones

  Background:
    Given que estoy en la página de inicio de sesión

  Scenario: Inicio de sesión exitoso con credenciales válidas
    When ingreso el usuario "<DEMOQA_USERNAME>" y la contraseña "<DEMOQA_PASSWORD>"
    And hago clic en el botón de inicio de sesión
    Then debería ser redirigido al perfil del usuario
    And debería ver mi nombre de usuario en el encabezado

  Scenario: Error al ingresar usuario incorrecto
    When ingreso el usuario "usuarioInvalido" y la contraseña "Test@1234!"
    And hago clic en el botón de inicio de sesión
    Then debería ver el mensaje de error "Invalid username or password!"

  Scenario: Error al ingresar contraseña incorrecta
    When ingreso el usuario "<DEMOQA_USERNAME>" y la contraseña "claveIncorrecta"
    And hago clic en el botón de inicio de sesión
    Then debería ver el mensaje de error "Invalid username or password!"

  Scenario: Error al dejar los campos vacíos
    When hago clic en el botón de inicio de sesión sin ingresar datos
    Then los campos obligatorios deben estar marcados como inválidos

  Scenario: Cierre de sesión exitoso
    Given que estoy autenticado como usuario válido
    When hago clic en el botón de cerrar sesión
    Then debería ser redirigido a la página de inicio de sesión
