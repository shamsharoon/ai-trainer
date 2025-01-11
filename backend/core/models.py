from django.db import models

class ChatLog(models.Model):
    user_id = models.CharField(max_length=255)
    job_posting = models.TextField()
    question = models.TextField()
    response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ChatLog {self.id}"
