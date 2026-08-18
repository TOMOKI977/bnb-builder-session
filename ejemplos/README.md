# La Feria del Trato

Un trato entra. **No hay un super-agente.** Hay una feria: cada puesto hace un oficio. Si querés la función entera, recorres varios — o mandás al **conserje**, que los contrata por vos.

Eso es por qué los agentes son el futuro (tienen caja y DNI, pueden pagarle al de al lado).  
Eso es por qué **Era** tiene sentido (el marketplace es el plano de la feria).  
Eso es por qué no alcanza un scanner de wallets.

## Los 5 puestos

| # | Puesto | Oficio | Lo que entra | Lo que sale |
|---|--------|--------|--------------|-------------|
| 01 | [Conserje](01-conserje/PROMPT.md) | Camina la feria | El trato completo | Un solo informe |
| 02 | [Portero](02-portero/PROMPT.md) | ¿Este mensaje es limpio? | Texto | Puntaje + red flags |
| 03 | [Crítico](03-critico/PROMPT.md) | ¿Este agente es real? | `agent_id` ERC-8004 | ¿Vivo, oficio, endpoint? |
| 04 | [Cajero](04-cajero/PROMPT.md) | Cobra un insight | Pregunta / texto | El dato, pagado por su caja |
| 05 | [Escribano](05-escribano/PROMPT.md) | Sella el trabajo | Hash o resumen | Quote firmado + rastro |

Leé primero [00-carcasa.md](00-carcasa.md): es el molde que **no cambia**. Después pegá **un** `PROMPT.md` en Cursor o Claude Code.

Paso a paso (login, deploy, `feria.json`): [COMO-DESPLEGAR.md](COMO-DESPLEGAR.md). Plantilla: [feria.json.example](feria.json.example).

Pizarrón de sala (no es el producto): [demo/README.md](demo/README.md).

## Cómo se complementan

```
Humano ──paga una vez──► Conserje
                            ├──paga──► Portero   (el mensaje)
                            ├──paga──► Crítico   (si hay un bot/agent_id)
                            ├──paga──► Cajero    (si hace falta más contexto)
                            └──paga──► Escribano (sella el informe)
```

No tenés que usar los cinco. Un mensaje suelto = solo portero. Un bot desconocido = crítico. La cena completa = conserje.

## Deploy (on-chain, testnet)

Cuando el agente responde en local (`bag dev` + quote):

```
bag platform login
bag deploy --provider bnb
bag deploy verify --provider bnb
bag erc8004 show
```

Trial BNB: **48 h** en testnet, URL pública, DNI ERC-8004. Wallet de usar y tirar. No AWS. No mainnet.

## Cochabamba · qué te llevás

En la Builder Session ves la feria armada. En casa repetís **un** puesto (o sumás uno nuevo) con estos prompts. El conocimiento que se queda: un agente es un oficio con caja y DNI; varios se complementan; Era es el plano para encontrarlos.
