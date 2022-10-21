import { HttpException, Injectable } from '@nestjs/common';
import FFmpegCmd from 'ffmpeg-command';

@Injectable()
export class AppService {
  async getStreamLink() {
    const video = process.env.PWD + '/public/assets/video/Big-Buck-Bunny.mp4';
    const firstAudio =
      process.env.PWD + '/public/assets/audio/Bin-Tere-Sanam.mp3';
    const secondAudio = process.env.PWD + '/public/assets/audio/Bilionera.mp3';
    const outputName = `/public/assets/output/${new Date().getTime()}.m3u8`;
    const output = process.env.PWD + outputName;
    const command = `-i ${video} -i ${firstAudio} -i ${secondAudio} -filter_complex "[1][2]amix=inputs=2[a]" -map 0:v -map "[a]" -c:v copy -bsf:v h264_mp4toannexb -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${output}`;

    const ffmpegCmd = new FFmpegCmd({
      loglevel: 'info',
      cwd: process.env.PWD + '/public/assets',
    });
    ffmpegCmd.add(command);
    try {
      await ffmpegCmd.exec();
      return outputName;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
