// class PeerService {
//     constructor() {
//         if (!this.peer) {
//             this.peer = new RTCPeerConnection({
//                 iceServers: [
//                     {
//                         urls: [
//                             "stun:stun.l.google.com:19302",
//                             "stun:global.stun.twilio.com:3478",
//                         ],
//                     },
//                 ],
//             });
//         }
//     }
//     async getOffer() {
//         const offer = await this.peer.createOffer();
//         await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//         return offer;
//     }
//     async getAnswer(offer) {
//         if(this.peer){
//             await this.peer.setRemoteDescription(offer);
//             const answer  = await this.peer.createAnswer();
//             await this.peer.setLocalDescription(new RTCSessionDescription(answer));
//             return answer;
//         }
//     } 
//     async setLocalDescription(answer) {
//         if (this.peer) {
//             await this.peer.setLocalDescription(new RTCSessionDescription(answer));
//         }
//     }
// }

// export default new PeerService();
class PeerService {
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ],
                    },
                ],
            });
        }
    }

    async getOffer() {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
    }

    async getAnswer(offer) {
        if (this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));
            return answer;
        }
    }

    async setRemoteDescription(offer) {
        if (this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
        }
    }

    async setLocalDescription(answer) {
        if (this.peer) {
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));
        }
    }
}

export default new PeerService();
