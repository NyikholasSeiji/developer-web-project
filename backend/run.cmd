@echo off
rem Sobe a API (porta 8081). Uso: run.cmd            -> spring-boot:run
rem                               run.cmd <goals>    -> ex.: run.cmd clean compile
setlocal
cd /d "%~dp0"

rem Carrega as variaveis do .env (linhas CHAVE=valor; ignora comentarios com #)
if exist ".env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do set "%%A=%%B"
)

if not defined JAVA_HOME (
  echo [ERRO] JAVA_HOME nao definido. Copie .env.example para .env e informe a pasta do JDK.
  exit /b 1
)
if not exist "%JAVA_HOME%\bin\java.exe" (
  echo [ERRO] JDK nao encontrado em "%JAVA_HOME%". Ajuste o JAVA_HOME no arquivo .env.
  exit /b 1
)

set "PATH=%JAVA_HOME%\bin;%PATH%"
echo Usando Java em: %JAVA_HOME%

if "%~1"=="" (
  call "%~dp0mvnw.cmd" spring-boot:run
) else (
  call "%~dp0mvnw.cmd" %*
)
