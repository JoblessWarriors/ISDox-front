import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatSession } from '../../model/chat-session/chat-session.model';
import { ChatActionEnum } from './chat-action-enum';
import { ChatMessageMapping } from '../../model/chat-message/chat-message-mapping.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);

  public createChatSession(): Observable<ChatSession> {
    const url = ChatActionEnum.toUrl(ChatActionEnum.POST_SESSION);
    return this.http.post<ChatSession>(url, null);
  }

  public createChatMessage(sessionId: string, body: any): Observable<ChatMessageMapping> {
    const url = ChatActionEnum.toUrl(ChatActionEnum.POST_MESSAGE, sessionId);
    return this.http.post<ChatMessageMapping>(url, body);
  }
}
