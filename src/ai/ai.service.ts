import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly baseUrl = process.env.AI_SERVICE_URL;
  private readonly serviceKey = process.env.INTERNAL_SERVICE_KEY;

  async sendChat(payload: {
    tenant_id: string;
    conversation_id: string;
    session_id: string;
    message: string;
    context: { history: { role: string; content: string }[] };
  }) {
    const res = await axios.post(`${this.baseUrl}/internal/chat`, payload, {
      headers: { 'X-Internal-Service-Key': this.serviceKey },
    });
    return res.data;
  }
}