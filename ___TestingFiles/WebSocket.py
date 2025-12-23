# WebSocket.py
# Requiere: pip install websocket-client
# Ejecutar: python WebSocket.py

import json
import time
from dataclasses import dataclass, field
from typing import Any, Dict, Optional

import websocket  # websocket-client


# ------------------ Config ------------------
ATTRACTION_CODE = "NM-01-01"         # Usa "*" para aceptar todas las atracciones
WS_ENDPOINT     = "ws://sockets.ronic.mx:6200"


# ------------------ Modelos ------------------
@dataclass
class Guest:
    id: int = 0
    identifier: str = ""
    gender: str = ""
    firstName: str = ""
    familyName: str = ""
    lastName: str = ""
    age: int = 0
    mail: str = ""
    hasDisability: int = 0   # 0 = no, 1 = sí
    disability: str = ""
    phone: str = ""
    creationDate: str = ""   # "YYYY-MM-DD HH:MM:SS"
    picture: str = ""
    zipCode: str = ""
    language: str = "EN"

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> "Guest":
        return Guest(
            id=data.get("id", 0),
            identifier=data.get("identifier", ""),
            gender=data.get("gender", ""),
            firstName=data.get("firstName", ""),
            familyName=data.get("familyName", ""),
            lastName=data.get("lastName", ""),
            age=data.get("age", 0),
            mail=data.get("mail", ""),
            hasDisability=data.get("hasDisability", 0),
            disability=data.get("disability", ""),
            phone=data.get("phone", ""),
            creationDate=data.get("creationDate", ""),
            picture=data.get("picture", ""),
            zipCode=data.get("zipCode", ""),
            language=data.get("language", "EN"),
        )


@dataclass
class TagEvent:
    inst: str = "TAG_EVENT"
    notificationType: str = "entrance"  # "entrance" | "exit" | "tap"
    identifier: str = ""
    readTime: str = ""                  # "YYYY-MM-DD HH:MM:SS"
    readPointName: str = ""             # attractionCode
    user: Optional[Guest] = field(default=None)

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> "TagEvent":
        return TagEvent(
            inst="TAG_EVENT",
            notificationType=data.get("notificationType", "entrance"),
            identifier=data.get("identifier", ""),
            readTime=data.get("readTime", ""),
            readPointName=data.get("readPointName", ""),
            user=Guest.from_dict(data.get("user", {})) if data.get("user") else None,
        )


# ------------------ Cliente WebSocket ------------------
class TagWSClient:
    def __init__(self, endpoint: str, attraction_code: str):
        self.endpoint = endpoint
        self.attraction_code = attraction_code
        self.remote_uuid: str = ""
        self.local_ip: str = ""
        self.ws: Optional[websocket.WebSocketApp] = None

    def connect(self):
        self.ws = websocket.WebSocketApp(
            self.endpoint,
            on_open=self.on_open,
            on_message=self.on_message,
            on_error=self.on_error,
            on_close=self.on_close,
        )

        # Ejecuta el loop en el hilo principal (bloqueante)
        self.ws.run_forever(ping_interval=25, ping_timeout=10)

    # ---- Callbacks ----
    def on_open(self, ws):
        print("[CLIENT CONNECTED]")

    def on_message(self, ws, message: str):
        try:
            data = json.loads(message)
        except json.JSONDecodeError:
            print("[CLIENT WARN] Mensaje no-JSON:", message)
            return

        inst = data.get("inst")
        if inst == "CLIENT_WELCOME":
            self.remote_uuid = data.get("uuid", "")
            self.local_ip = data.get("localIp", "")

            payload = {
                "inst": "REGISTER_CLIENT",
                "ipAddress": self.local_ip,
                "uuid": self.remote_uuid,
                "attractionCode": self.attraction_code,
            }
            ws.send(json.dumps(payload))
            # print por claridad
            print("[REGISTER_CLIENT] =>", payload)

        elif inst == "CLIENT_REGISTERED":
            print("[CLIENT_REGISTERED]", data)

        elif inst == "TAG_EVENT":
            tag_event = TagEvent.from_dict(data)
            print("[TAG_EVENT]", tag_event)

            # Si quieres objetos separados:
            if tag_event.user:
                print("[TAG_USER ]", tag_event.user)

            # Aquí va tu lógica de negocio:
            # process_tag_event(tag_event)

        else:
            # Otros mensajes
            print("[CLIENT MSG]", data)

    def on_close(self, ws, status_code, msg):
        print("[CLIENT CLOSED]", status_code, msg)

    def on_error(self, ws, error):
        print("[CLIENT ERROR]", error)


# ------------------ Ejecución ------------------
if __name__ == "__main__":
    client = TagWSClient(WS_ENDPOINT, ATTRACTION_CODE)
    # Reconexión básica: si se cae, intenta reconectar con backoff
    backoff = 1
    while True:
        try:
            client.connect()
        except KeyboardInterrupt:
            print("\n[SIGINT] Saliendo…")
            break
        except Exception as e:
            print(f"[RECONNECT in {backoff}s] error:", e)
            time.sleep(backoff)
            backoff = min(backoff * 2, 60)  # hasta 60s
        else:
            # run_forever terminó sin excepción (cierre limpio): reconectar
            time.sleep(1)
            backoff = 1
