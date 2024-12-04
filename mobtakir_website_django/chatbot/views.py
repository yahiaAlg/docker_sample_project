from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from .models import ChatSession, ChatMessage
import ollama


@login_required
def chat_view(request):
    if request.method == "POST":
        session_id = request.POST.get("session_id")
        prompt = request.POST.get("prompt")

        # Get or create chat session
        if session_id:
            session = get_object_or_404(ChatSession, id=session_id, user=request.user)
        else:
            session = ChatSession.objects.create(
                user=request.user,
                title=prompt[:50],  # Use first 50 chars of first message as title
            )

        # Save user message
        ChatMessage.objects.create(session=session, role="user", content=prompt)

        try:
            # Get response from Ollama
            response = ollama.chat(
                model="phi3", messages=[{"role": "user", "content": prompt}]
            )

            # Save assistant response
            assistant_message = ChatMessage.objects.create(
                session=session,
                role="assistant",
                content=response["message"]["content"],
            )

            return JsonResponse(
                {
                    "content": assistant_message.content,
                    "timestamp": assistant_message.time_formatted,
                    "session_id": session.id,
                }
            )

        except ollama.ResponseError as e:
            return JsonResponse(
                {"error": str(e.error), "status": e.status_code}, status=400
            )

    # GET request - render chat interface
    sessions = ChatSession.objects.filter(user=request.user)
    return render(request, "chat_interface.html", {"sessions": sessions})


@login_required
def chat_history_view(request, session_id):
    session = get_object_or_404(ChatSession, id=session_id, user=request.user)
    messages = session.messages.all()
    return JsonResponse(
        {"messages": list(messages.values("role", "content", "timestamp"))}
    )


@login_required
def chat_sessions_view(request):
    sessions = ChatSession.objects.filter(user=request.user)
    return JsonResponse(
        {"sessions": list(sessions.values("id", "title", "created_at", "updated_at"))}
    )
