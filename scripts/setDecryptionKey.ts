import { clerkClient } from '@clerk/clerk-sdk-node';
import 'dotenv/config'; // .env 변수를 로드하기 위함

// 로깅을 위해 console.debug를 사용합니다.
const logger = {
  debug: (...args: any[]) => console.log('[DEBUG]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  log: (...args: any[]) => console.log('[INFO]', ...args),
};

async function setDecryptionKeyForUser() {
  logger.debug('setDecryptionKeyForUser 함수 진입');
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (!clerkSecretKey) {
    logger.error('오류: CLERK_SECRET_KEY 환경 변수가 설정되지 않았습니다.');
    logger.error('`.env.local` 파일에 `CLERK_SECRET_KEY=sk_test_...` 와 같이 설정해주세요.');
    logger.debug('setDecryptionKeyForUser 함수 종료 (CLERK_SECRET_KEY 없음)');
    return;
  }
  logger.debug('CLERK_SECRET_KEY가 설정됨');

  const userId = process.argv[2];
  const decryptionKey = process.argv[3];
  logger.debug(`명령줄 인자: userId='${userId}', decryptionKey='${decryptionKey}'`);


  if (!userId || !decryptionKey) {
    logger.error('사용법: pnpm ts-node scripts/setDecryptionKey.ts <userId> <decryptionKey>');
    logger.error('예시: pnpm ts-node scripts/setDecryptionKey.ts user_1A2b3C4dE5f6G7hI8j9K0L1M2N3O4P5Q6R7S8T9U test_decryption_key_1234');
    logger.debug('setDecryptionKeyForUser 함수 종료 (인자 부족)');
    return;
  }

  try {
    logger.log(`사용자 ID: ${userId}, 복호화 키 설정 시도...`);
    const user = await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        decryptionKey: decryptionKey,
      },
    });
    logger.debug('Clerk API 호출 성공');
    logger.log(`성공: 사용자 ${userId}에 복호화 키가 설정되었습니다.`);
    logger.debug('업데이트된 사용자 privateMetadata:', user.privateMetadata);
  } catch (error: any) {
    logger.error('오류: 복호화 키 설정 중 문제가 발생했습니다.', error.message);
    if (error.statusCode === 404) {
      logger.error(`오류: 사용자 ID ''${userId}''를 찾을 수 없습니다. 올바른 사용자 ID인지 확인해주세요.`);
    } else {
      logger.error('자세한 오류:', error);
    }
  } finally {
    logger.debug('setDecryptionKeyForUser 함수 종료');
  }
}

setDecryptionKeyForUser(); 