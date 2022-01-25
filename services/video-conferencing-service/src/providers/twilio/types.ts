import {
  RoomListInstanceCreateOptions,
  RoomRoomStatus,
} from 'twilio/lib/rest/video/v1/room';
import {
  ExternalStorageOptions,
  MeetingOptions,
  MeetingResponse,
  // S3TargetOptions,
  SessionOptions,
  SessionResponse,
  VideoChatInterface,
  WebhookPayloadParameters,
} from '../..';
import {RoomRoomType} from 'twilio/lib/rest/insights/v1/room';
export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  apiSid: string;
  apiSecret: string;
  awsCredentialSid?: string;
}

export interface TwilioMeetingOptions
  extends MeetingOptions,
    RoomListInstanceCreateOptions {
  endToEndEncryption?: boolean;
  enableArchiving?: boolean;
  isScheduled: boolean;
  scheduleTime?: Date;
}
export interface TwilioVideoChat extends VideoChatInterface {
  getToken(options: SessionOptions): Promise<SessionResponse>;
  getMeetingLink(options: MeetingOptions): Promise<MeetingResponse>;

  setUploadTarget(storageOptions: ExternalStorageOptions): Promise<void>;
}

export interface TwilioMeetingResponse extends MeetingResponse {}

export interface TwilioS3TargetOptions extends ExternalStorageOptions {
  awsS3Url: string;
  bucket?: string;
}
export interface TwilioSessonOptions extends SessionOptions {
  sessionId: string;
}

export interface TwilioWebhookPayload extends WebhookPayloadParameters {
  accountSid?: string;
  roomName?: string;
  roomSid?: string;
  roomStatus?: RoomRoomStatus;
  roomType?: RoomRoomType;
  statusCallbackEvent?: string;
  timestamp?: string;
  participantSid?: string;
  participantStatus?: string;
  participantDuration?: number;
  roomDuration?: number;
  sequenceNumber?: number;
  recordingSid?: string;
}

export enum TwilioStatusCallbackEvents {
  RoomCreated = 'room-created',
  RoomEnded = 'room-ended',
  ParticipantConnected = 'participant-connected',
  ParticipantDisconnected = 'participant-disconnected',
  RecordingStarted = 'recording-started',
  RecordingCompleted = 'recording-completed',
}
