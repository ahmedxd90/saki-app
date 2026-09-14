import 'dart:io';

import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

import 'package:saki/helpers/quick_help.dart';
import 'package:saki/models/others/video_editor_model.dart';

class VideoEditorScreen extends StatefulWidget {
  const VideoEditorScreen({Key? key, required this.file}) : super(key: key);
  final File file;

  @override
  State<VideoEditorScreen> createState() => _VideoEditorScreenState();
}

class _VideoEditorScreenState extends State<VideoEditorScreen> {
  late final VideoPlayerController _player;
  bool _ready = false;

  @override
  void initState() {
    super.initState();
    _player = VideoPlayerController.file(widget.file)
      ..initialize().then((_) {
        if (mounted) setState(() => _ready = true);
      });
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }

  void _useVideo() {
    QuickHelp.goBackToPreviousPage(
      context,
      result: VideoEditorModel(videoFile: widget.file, coverPath: widget.file.path),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Preview video')),
      body: Column(
        children: [
          Expanded(
            child: Center(
              child: _ready
                  ? AspectRatio(
                      aspectRatio: _player.value.aspectRatio,
                      child: VideoPlayer(_player),
                    )
                  : const CircularProgressIndicator(),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _ready ? _useVideo : null,
                    child: const Text('Use video'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: _ready
          ? FloatingActionButton(
              onPressed: () => setState(() {
                _player.value.isPlaying ? _player.pause() : _player.play();
              }),
              child: Icon(_player.value.isPlaying ? Icons.pause : Icons.play_arrow),
            )
          : null,
    );
  }
}
