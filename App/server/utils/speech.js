async function main() {
	
	// set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\ricks\Documents\CZ3002 Advanced Software Engineering\groundZero\winter-quanta-290809-323877f272bd.json
  //set GOOGLE_APPLICATION_CREDENTIALS= C:\Users\limka\OneDrive\Documents\NTU\Y3S1\CZ3002 ASE\app\SpeechRecognition\winter-quanta-290809-323877f272bd.json
    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');
    const fs = require('fs');
  
    // Creates a client
    const client = new speech.SpeechClient();
  
    // The name of the audio file to transcribe
    const fileName = 'C:/Users/limka/OneDrive/Documents/NTU/Y3S1/CZ3002 ASE/app/LingLing/App/server/utils/OSR.wav';
  
    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString('base64');
  
    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 8000,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };
  
    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
    console.log(`Transcription: ${transcription}`);
	
	// Save to txt file
	// fs.writeFile("Transcript.txt", transcription, function(err) {
	// 	if(err) {
	// 		return console.log(err);
	// 	}
	// }); 

  }
  main().catch(console.error);