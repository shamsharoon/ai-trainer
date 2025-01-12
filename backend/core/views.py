import json
from django.shortcuts import render
from django.http import HttpResponse
import cohere
import sounddevice as sd
import numpy as np
import wavio
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path
import os
import sys
import signal
import time
from mutagen.mp3 import MP3
import threading
from django.http import JsonResponse
from django.middleware.csrf import get_token


def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})

def helloWorld(request):
    return HttpResponse("Hello, World!")

# Render the index.html template
def index(request):
    return render(request, 'core/index.html')

def start_interview(request):
    if request.method == "POST":
        try:
            # Load environment variables
            # load_dotenv()

            # API keys
            # api_key_cohere = os.getenv("pwDNTzr285NRaozXPGpd3l06OYreuHDujCG5bPF1")
            # api_key_openai = os.getenv("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")

            # Initialize clients
            co = cohere.Client(api_key="pwDNTzr285NRaozXPGpd3l06OYreuHDujCG5bPF1")
            client = OpenAI(api_key="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")

            def record_audio(filename="interviewee.wav", samplerate=44100):
                print("Recording... Type 'exit' to stop.")
                recording = []
                stop_recording = threading.Event()

                def callback(indata, frames, time, status):
                    if status:
                        print(status)
                    recording.append(indata.copy())

                def listen_for_exit():
                    while True:
                        user_input = input()
                        if user_input.lower() == "exit":
                            stop_recording.set()
                            break

                listener_thread = threading.Thread(target=listen_for_exit)
                listener_thread.start()

                try:
                    with sd.InputStream(samplerate=samplerate, channels=1, callback=callback):
                        while not stop_recording.is_set():
                            sd.sleep(1000)
                except KeyboardInterrupt:
                    pass

                recording = np.concatenate(recording, axis=0)
                wavio.write(filename, recording, samplerate, sampwidth=2)


            def speech_to_text():
                audio_file = open("interviewee.wav", "rb")
                transcription = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )
                user_response = transcription.text
                print("User:", user_response)
                return str(user_response)


            def text_to_speech(text):
                speech_file_path = Path(__file__).parent / "interviewer.mp3"
                response = client.audio.speech.create(
                    model="tts-1-hd",
                    voice="onyx",
                    input=text,
                )
                response.stream_to_file(speech_file_path)

                audio = MP3(speech_file_path)
                duration = audio.info.length
                os.system(f"{speech_file_path}")
                time.sleep(duration)


            def generate_text(chat_history):
                message = input("User: ")
                if message.lower() == "stop":
                    print("Exiting conversation.")
                    sys.exit(0)

                chat_history.append({"role": "USER", "text": message})

                response = co.chat(
                    model="command-r-plus",
                    chat_history=chat_history,
                    message=message
                )

                generated_text = response.text
                print("\nInterviewer:", generated_text, "\n")
                chat_history.append({"role": "CHATBOT", "text": generated_text})

                return generated_text


            def chat_bot():
                TURNS = 5
                data = json.loads(request.body)
                form_data = data.get("formData", {})
                print("Received Form Data:", form_data)  # Debugging
                
                job_posting = form_data.get("jobDescription", "")
                print(job_posting)
                

                chat_history = [
                    {"role": "USER", "text": "I am applying for a job, I am the interviewee"},
                    {"role": "CHATBOT", "text": f"Act as a professional job interviewer don't list anything like a list, talk very much like a real life recruiter and limit your response to 200 words, after 3 questions ask if the interviewee has any questions otherwise end the interview and give a score out of 100 how you think it went. You will ask {TURNS} questions, engaging naturally, and adapting to answers. Provide constructive feedback only if requested."},
                    {"role": "USER", "text": f"This is the job posting: {job_posting}, ask me technical questions related to the job position."}
                ]

                # Display transcriptions on the screen
                def display_transcription(transcription):
                    print(f"\n\nTranscription: {transcription}\n\n")
                    return JsonResponse({"transcription": transcription})
                

                # Modify speech_to_text to display transcription
                def speech_to_text():
                    audio_file = open("interviewee.wav", "rb")
                    transcription = client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file
                    )
                    user_response = transcription.text
                    print("User:", user_response)
                    display_transcription(user_response)
                    return str(user_response)

                initial_message = "Hello! I am the hiring manager. Let's start the interview. Can you please tell me a bit about yourself."
                print("Interviewer:", initial_message, "\n")
                chat_history.append({"role": "CHATBOT", "text": initial_message})
                text_to_speech(initial_message)

                while TURNS > 0:
                    TURNS -= 1
                    record_audio()
                    user_message = speech_to_text()
                    chat_history.append({"role": "USER", "text": user_message})

                    response = co.chat(
                        model="command-r-plus",
                        chat_history=chat_history,
                        message=user_message
                    )

                    print("Interviewer:", response.text, "\n")
                    chat_history.append({"role": "CHATBOT", "text": response.text})
                    text_to_speech(response.text)


            def main():
                print("AI Interview Trainer Initialized. Press Ctrl+C to stop.")
                chat_bot()


            if __name__ == "__main__":
                main()

            main()
        except Exception as e:
            print(e)
            return HttpResponse(f"An error occurred: {e}.")